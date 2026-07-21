import type { FinancialProfile } from "@/types/financial";
import type { FinancialPersonality } from "@/types/database.types";
import type { ChatMessage } from "@/types/coach";
import { calculateHealthScore } from "@/lib/engine/healthScore";
import { generateRecommendations } from "@/lib/engine/recommendations";
import { debtVsInvesting } from "@/lib/simulators/debtVsInvesting";
import { categorize } from "@/lib/coach/intentRouter";
import { detectWhatIfScenario } from "@/lib/coach/whatIfScenarios";
import { buildDecisionAnalysis, type PurchaseType } from "@/lib/coach/decisionAnalysis";
import { getFollowUps } from "@/lib/coach/followUps";
import { extractDollarAmount, extractMonthlyPayment } from "@/lib/coach/extract";
import { PERSONALITY_MODES } from "@/lib/constants/personalityModes";
import { formatCurrency, formatPercent } from "@/utils/formatters";

function isAffordabilityQuestion(q: string) {
  return /\b(afford|buy|purchase|get a)\b/i.test(q);
}
function isDebtVsInvestingQuestion(q: string) {
  return /\b(pay off debt|invest|investing).*\b(or|vs|versus)\b/i.test(q) || /debt.{0,20}invest/i.test(q);
}
function isHealthScoreQuestion(q: string) {
  return /\b(health score|how am i doing|financial health|doing financially)\b/i.test(q);
}

function extractPurchaseLabel(question: string, fallback: string): string {
  const match = question.match(/\b(?:afford|buy|get)\s+(?:a|an)?\s*([^?]+?)(?:\s+at\s+\$|\s+for\s+\$|\?|$)/i);
  const captured = match?.[1]?.trim();
  return captured && captured.length > 1 && captured.length < 40 ? captured : fallback;
}

/** Prepends a "coach" personality encouragement line, or trims to the first sentence for "minimal" - "analyst" gets the full text as-is. */
function applyPersonalityTone(content: string, personality: FinancialPersonality): string {
  if (personality === "minimal") {
    const firstSentence = content.split(/(?<=[.!?])\s/)[0];
    return firstSentence ?? content;
  }
  if (personality === "coach") {
    const encouragement = PERSONALITY_MODES.coach.encouragement;
    const prefix = encouragement[Math.floor(Math.random() * encouragement.length)];
    return `${prefix} ${content}`;
  }
  return content;
}

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `coach-${Date.now()}-${messageCounter}`;
}

/**
 * Today: rule-based, grounded 100% in the user's real numbers via lib/engine
 * and lib/simulators - no hallucination risk. This function (plus
 * lib/coach/systemPrompt.ts) is the entire seam for swapping in a real LLM
 * later: the call site (app/api/assistant/route.ts) wouldn't need to change,
 * only this function's internals would become a model call using
 * COACH_SYSTEM_PROMPT + buildCoachContext(profile, personality).
 */
export function answerCoachQuestion(
  question: string,
  profile: FinancialProfile,
  personality: FinancialPersonality = "coach"
): ChatMessage {
  const q = question.trim();
  const category = categorize(q);

  const whatIfScenario = detectWhatIfScenario(q);
  if (whatIfScenario) {
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(
        `Here's a live simulator for that — drag the sliders to see how it changes your projected net worth.`,
        personality
      ),
      category,
      whatIfScenario,
      followUps: getFollowUps(category),
    };
  }

  if (isAffordabilityQuestion(q) && (category === "car_buying" || category === "home_buying" || category === "large_purchase")) {
    const purchasePrice = extractDollarAmount(q);
    const monthlyPayment = extractMonthlyPayment(q) ?? (purchasePrice ? Math.round(purchasePrice / 48) : null);

    if (!purchasePrice && !monthlyPayment) {
      return {
        id: nextId(),
        role: "assistant",
        content: applyPersonalityTone(
          `Tell me the price (or the monthly payment) and I'll break down exactly how it affects your savings rate, goals, and Financial Health Score — e.g. "Can I afford a $45,000 car at $600/month?"`,
          personality
        ),
        category,
        followUps: getFollowUps(category),
      };
    }

    const purchaseType: PurchaseType = category === "car_buying" ? "car" : category === "home_buying" ? "house" : "other";
    const resolvedPrice = purchasePrice ?? (monthlyPayment ?? 0) * 48;
    const resolvedPayment = monthlyPayment ?? Math.round((purchasePrice ?? 0) / 48);

    const decisionAnalysis = buildDecisionAnalysis(
      {
        purchaseLabel: extractPurchaseLabel(q, purchaseType === "car" ? "this car" : purchaseType === "house" ? "this house" : "this purchase"),
        purchaseType,
        purchasePrice: resolvedPrice,
        monthlyPayment: resolvedPayment,
        downPayment: 0,
      },
      profile
    );

    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(decisionAnalysis.recommendation, personality),
      category,
      decisionAnalysis,
      followUps: getFollowUps(category),
    };
  }

  if (isDebtVsInvestingQuestion(q)) {
    const worstDebt = [...profile.liabilities].sort((a, b) => b.interestRate - a.interestRate)[0];
    if (!worstDebt) {
      return {
        id: nextId(),
        role: "assistant",
        content: applyPersonalityTone("You don't have any debt on file, so investing any extra cash is the clear move.", personality),
        category,
        followUps: getFollowUps(category),
      };
    }
    const surplus = Math.max(50, Math.round(profile.monthlyIncome * profile.savingsRate * 0.5));
    const result = debtVsInvesting({
      extraMonthlyAmount: surplus,
      debtInterestRate: worstDebt.interestRate,
      debtBalance: worstDebt.balance,
      expectedInvestmentReturn: 7,
      horizonYears: 10,
    });
    const verb = result.recommendation === "pay_debt_first" ? "paying off" : "investing";
    const content = `Putting **${formatCurrency(surplus)}/mo** toward ${
      result.recommendation === "roughly_equal" ? "either" : verb
    } your **${worstDebt.label}** (${formatPercent(worstDebt.interestRate / 100, 1)} APR) vs. investing it instead:\n\n- Over 10 years, that's about **${formatCurrency(
      result.differenceAmount
    )}** ${result.recommendation === "roughly_equal" ? "difference either way" : `better if you prioritize ${verb === "paying off" ? "debt" : "investing"}`}.\n- Assumes a 7% average annual investment return, compounded monthly.`;

    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (isHealthScoreQuestion(q)) {
    const health = calculateHealthScore(profile);
    const content = `Your **Financial Health Score is ${health.overall}/100**:\n\n| Area | Score |\n| --- | --- |\n| Cash Flow | ${health.cashFlow} |\n| Debt | ${health.debt} |\n| Savings | ${health.savings} |\n| Investment | ${health.investment} |\n\n${
      health.overall >= 75 ? "You're in strong shape." : "There's clear room to improve — check your recommendations for the fastest wins."
    }`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  const [topRecommendation] = generateRecommendations(profile);
  const content = topRecommendation
    ? `I can help most with affordability questions, debt-vs-investing trade-offs, and your health score. In the meantime, your top recommendation right now:\n\n> ${topRecommendation.description}`
    : `I can help with questions like "Can I afford a $30,000 car?", "Should I pay off debt or invest?", or "How's my financial health?" — ask me one of those.`;

  return {
    id: nextId(),
    role: "assistant",
    content: applyPersonalityTone(content, personality),
    category,
    followUps: getFollowUps(category),
  };
}
