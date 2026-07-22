import type { FinancialProfile } from "@/types/financial";
import type { FinancialPersonality } from "@/types/database.types";
import type { ChatMessage } from "@/types/coach";
import { calculateHealthScore, CASH_FLOW_TARGET_SAVINGS_RATE } from "@/lib/engine/healthScore";
import { generateRecommendations } from "@/lib/engine/recommendations";
import { debtVsInvesting } from "@/lib/simulators/debtVsInvesting";
import { projectGoal } from "@/lib/engine/goalProjections";
import { categorize } from "@/lib/coach/intentRouter";
import { detectWhatIfScenario } from "@/lib/coach/whatIfScenarios";
import { buildDecisionAnalysis, type PurchaseType } from "@/lib/coach/decisionAnalysis";
import { getFollowUps } from "@/lib/coach/followUps";
import { extractDollarAmount, extractMonthlyPayment } from "@/lib/coach/extract";
import { PERSONALITY_MODES } from "@/lib/constants/personalityModes";
import { EXPENSE_CATEGORY_LABELS } from "@/types/financial";
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
function isEmergencyFundTimelineQuestion(q: string) {
  return /\bemergency fund\b/i.test(q) && /\b(how long|when|goal)\b/i.test(q);
}
function isSubscriptionQuestion(q: string) {
  return /\bsubscriptions?\b/i.test(q);
}
function isOverspendingQuestion(q: string) {
  return /\boverspend/i.test(q);
}
function isSavingsAdviceQuestion(q: string) {
  return /\b(how much should i save|how can i save|save (each|every|per) month)\b/i.test(q);
}
function isWhatsHurtingQuestion(q: string) {
  return /\bhurting\b/i.test(q);
}

/** Largest non-zero expense category, or null if none logged. */
function biggestExpenseCategory(profile: FinancialProfile): { label: string; amount: number } | null {
  const [entry] = Object.entries(profile.expensesByCategory)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);
  if (!entry) return null;
  return { label: EXPENSE_CATEGORY_LABELS[entry[0] as keyof typeof EXPENSE_CATEGORY_LABELS], amount: entry[1] };
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

  const whatIfScenario = detectWhatIfScenario(q, profile);
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

  if (isEmergencyFundTimelineQuestion(q)) {
    const efGoal = profile.goals.find((g) => g.type === "emergency_fund");
    let content: string;
    if (efGoal && efGoal.monthlyContribution > 0) {
      const projection = projectGoal(efGoal);
      content =
        projection.monthsRemaining === 0
          ? `You've already hit your **${efGoal.title}** target of ${formatCurrency(efGoal.targetAmount)}.`
          : `At **${formatCurrency(efGoal.monthlyContribution)}/mo**, you'll reach your **${formatCurrency(
              efGoal.targetAmount
            )}** emergency fund goal in about **${projection.monthsRemaining} months** — you're currently at ${formatCurrency(
              efGoal.currentAmount
            )}.`;
    } else if (efGoal) {
      content = `You have an "${efGoal.title}" goal but no monthly contribution set for it — add one in Goals to get a timeline.`;
    } else {
      const health = calculateHealthScore(profile);
      const detail = health.details.savings;
      content = `You don't have a dedicated Emergency Fund goal set up, but based on your accounts you're at **${formatCurrency(
        detail.currentValue
      )}** of a **${formatCurrency(detail.targetValue)}** target (3 months of expenses). Add an Emergency Fund goal with a monthly contribution to get a precise timeline.`;
    }
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (isSubscriptionQuestion(q)) {
    const subs = profile.expensesByCategory.subscriptions ?? 0;
    const pctOfIncome = profile.monthlyIncome > 0 ? subs / profile.monthlyIncome : 0;
    const content =
      subs === 0
        ? `You haven't logged any subscription expenses — if you have any, add them in Settings so I can flag whether they're worth cutting.`
        : `You're spending **${formatCurrency(subs)}/mo** (${formatPercent(pctOfIncome)} of income) on subscriptions. ${
            pctOfIncome > 0.05
              ? "That's a meaningful chunk of your income — worth reviewing your statement for anything you don't use weekly."
              : "That's a reasonable share of your income — no obvious red flag there."
          } I only track this as one lump category today, not individual subscriptions, so you'll need to check your bank/card statement for which specific ones to cancel.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (isOverspendingQuestion(q)) {
    const biggest = biggestExpenseCategory(profile);
    const isOverspending = profile.savingsRate < 0.05;
    const content = `${
      isOverspending
        ? `Yes — your savings rate is **${formatPercent(profile.savingsRate)}**, below a healthy 5% buffer.`
        : `Not really — you're saving **${formatPercent(profile.savingsRate)}** of your income, which is healthy.`
    }${biggest ? ` Your biggest expense category is **${biggest.label}** at ${formatCurrency(biggest.amount)}/mo.` : ""}`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (isSavingsAdviceQuestion(q)) {
    const currentSurplus = profile.monthlyIncome - profile.monthlyExpenses;
    const explicitTarget = extractDollarAmount(q);
    let content: string;
    if (explicitTarget) {
      const gap = explicitTarget - currentSurplus;
      content =
        gap <= 0
          ? `You're already saving **${formatCurrency(currentSurplus)}/mo**, which clears your ${formatCurrency(
              explicitTarget
            )} target.`
          : `You're currently saving **${formatCurrency(currentSurplus)}/mo**. To hit **${formatCurrency(
              explicitTarget
            )}/mo**, you'd need to free up **${formatCurrency(gap)}** more — either cut expenses or increase income by that much.`;
    } else {
      const benchmarkAmount = profile.monthlyIncome * CASH_FLOW_TARGET_SAVINGS_RATE;
      content =
        currentSurplus >= benchmarkAmount
          ? `A common benchmark is saving **${formatPercent(CASH_FLOW_TARGET_SAVINGS_RATE)}** of your income — for you that's **${formatCurrency(
              benchmarkAmount
            )}/mo**. You're already there, saving ${formatCurrency(currentSurplus)}/mo (${formatPercent(profile.savingsRate)}).`
          : `A common benchmark is saving **${formatPercent(CASH_FLOW_TARGET_SAVINGS_RATE)}** of your income — for you that's **${formatCurrency(
              benchmarkAmount
            )}/mo**. You're currently at ${formatCurrency(currentSurplus)}/mo (${formatPercent(
              profile.savingsRate
            )}), about ${formatCurrency(benchmarkAmount - currentSurplus)} short of that.`;
    }
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "debt_payoff") {
    const worstDebt = [...profile.liabilities].sort((a, b) => b.interestRate - a.interestRate)[0];
    const content = worstDebt
      ? `Focus extra payments on your **${worstDebt.label}** first — it's your highest-rate debt at **${formatPercent(
          worstDebt.interestRate / 100,
          1
        )}** APR, with a ${formatCurrency(worstDebt.balance)} balance and a ${formatCurrency(
          worstDebt.minimumPayment
        )}/mo minimum. Paying the highest-rate debt first (the "avalanche" method) minimizes total interest paid, even when it's not the fastest balance to zero out.`
      : `You don't have any debt on file — nothing to pay off.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "investment_advice") {
    const health = calculateHealthScore(profile);
    const detail = health.details.investment;
    const content = `You have **${formatCurrency(profile.totalInvestmentAssets)}** invested, against a rough benchmark of **${formatCurrency(
      detail.targetValue
    )}** (half a year's income). ${
      detail.score >= 100 ? "You're ahead of that benchmark." : `You're at ${formatPercent(detail.score / 100)} of it.`
    } General principle: diversify (index funds spread risk across the market instead of betting on single stocks), match your risk level to your time horizon (more stocks when a goal is decades away, more bonds/cash as it gets close), and remember returns aren't guaranteed — markets can drop as well as rise.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "retirement") {
    const retirementBalance = profile.assets.filter((a) => a.type === "retirement").reduce((sum, a) => sum + a.balance, 0);
    const content =
      retirementBalance > 0
        ? `You have **${formatCurrency(
            retirementBalance
          )}** in retirement accounts. Starting early matters most here — money invested for retirement has decades to compound, so consistent contributions now beat larger ones later.`
        : `You don't have any accounts marked as type "Retirement" yet. If you have a 401(k) or IRA, add it in Settings so it counts toward your Financial Health Score's investment sub-score.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "credit_score") {
    const debtToIncome = profile.monthlyIncome > 0 ? profile.totalMinimumPayments / profile.monthlyIncome : 0;
    const content = `Summora Systems doesn't have access to your actual credit score. What I can tell you: your minimum debt payments are **${formatPercent(
      debtToIncome
    )}** of your income — generally, paying on time and keeping credit utilization low are the two biggest levers for your score. Check a free source like your card issuer or annualcreditreport.com for your actual number.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "taxes") {
    const content = `Summora Systems doesn't handle tax planning or filing — that's outside what this rule-based engine can ground in your numbers. For anything tax-specific (deductions, filing status, withholding), a licensed tax professional or CPA is the right call.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "insurance") {
    const insuranceSpend = profile.expensesByCategory.insurance ?? 0;
    const content =
      insuranceSpend > 0
        ? `You're spending **${formatCurrency(
            insuranceSpend
          )}/mo** on insurance. I don't know what types or coverage levels that includes, so I can't say if it's enough or too much — but it's worth an annual review to make sure your coverage still matches your situation (home value, dependents, health needs, etc.).`
        : `You haven't logged any insurance expenses. If you have any (health, auto, home, life), add them in Settings so they show up in your budget.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "career_decisions" || category === "salary_negotiation") {
    const content = `I don't have enough context to weigh in on the specific decision, but here's what I can ground in your numbers: at your current **${formatCurrency(
      profile.monthlyIncome
    )}/mo** income, try asking a "what if" question — e.g. "what if I got a $5,000 raise?" — to see exactly how a change would move your projected net worth.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  if (category === "college_savings") {
    const content = `Summora Systems doesn't have a dedicated college-savings goal type yet — the closest fit is adding a **Custom Goal** in Goals with your target amount and date, which will show up in projections just like any other goal.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  const [topRecommendation] = generateRecommendations(profile);

  if (isWhatsHurtingQuestion(q)) {
    const content = topRecommendation
      ? `**${topRecommendation.title}** — ${topRecommendation.description}`
      : `Nothing urgent stands out — your numbers look solid across the board right now.`;
    return {
      id: nextId(),
      role: "assistant",
      content: applyPersonalityTone(content, personality),
      category,
      followUps: getFollowUps(category),
    };
  }

  const content = topRecommendation
    ? `Your top recommendation right now: **${topRecommendation.title}** — ${topRecommendation.description}\n\nI can also help with affordability questions, debt-vs-investing trade-offs, your health score, savings targets, or a "what if" scenario.`
    : `Nothing urgent stands out in your numbers right now. Try asking about affordability, debt vs. investing, your health score, savings targets, or a "what if" scenario.`;

  return {
    id: nextId(),
    role: "assistant",
    content: applyPersonalityTone(content, personality),
    category,
    followUps: getFollowUps(category),
  };
}
