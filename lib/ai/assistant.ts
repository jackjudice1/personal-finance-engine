import type { FinancialProfile } from "@/types/financial";
import { calculateHealthScore } from "@/lib/engine/healthScore";
import { generateRecommendations } from "@/lib/engine/recommendations";
import { canIAffordThis } from "@/lib/simulators/canIAffordThis";
import { debtVsInvesting } from "@/lib/simulators/debtVsInvesting";
import { formatCurrency, formatPercent } from "@/utils/formatters";

/** Parses a dollar figure like "$45,000", "45k", or "45000 dollars" out of free text. */
function extractDollarAmount(text: string): number | null {
  const kMatch = text.match(/\$?\s?([\d,]+(?:\.\d+)?)\s?k\b/i);
  if (kMatch) return parseFloat(kMatch[1].replace(/,/g, "")) * 1000;

  const plain = text.match(/\$\s?([\d,]+(?:\.\d+)?)|([\d,]+(?:\.\d+)?)\s?(?:dollars|bucks)/i);
  if (plain) return parseFloat((plain[1] ?? plain[2]).replace(/,/g, ""));

  return null;
}

/** Parses a monthly payment mention like "$600/month" or "600 a month". */
function extractMonthlyPayment(text: string): number | null {
  const match = text.match(/\$?\s?([\d,]+(?:\.\d+)?)\s?(?:\/mo|\/month|per month|a month|monthly)/i);
  return match ? parseFloat(match[1].replace(/,/g, "")) : null;
}

function isAffordabilityQuestion(q: string) {
  return /\b(afford|buy|purchase|get a)\b/i.test(q);
}
function isDebtVsInvestingQuestion(q: string) {
  return /\b(pay off debt|invest|investing).*\b(or|vs|versus)\b/i.test(q) || /debt.{0,20}invest/i.test(q);
}
function isHealthScoreQuestion(q: string) {
  return /\b(health score|how am i doing|financial health|doing financially)\b/i.test(q);
}

/**
 * Today: rule-based intent matching over `question`, answered using the same
 * deterministic engine/simulator functions the rest of the app uses -
 * grounded in the user's real numbers, no hallucination risk. This single
 * function is the entire seam for swapping in a real LLM later (e.g. OpenAI):
 * the call site (app/api/assistant/route.ts) never changes, only this
 * function's internals would.
 */
export function answerQuestion(question: string, profile: FinancialProfile): string {
  const q = question.trim();

  if (isAffordabilityQuestion(q)) {
    const purchasePrice = extractDollarAmount(q);
    const monthlyPayment = extractMonthlyPayment(q) ?? (purchasePrice ? Math.round(purchasePrice / 48) : null);

    if (!purchasePrice && !monthlyPayment) {
      return "Tell me the price (or the monthly payment) and I'll tell you exactly how it affects your savings rate and goals — e.g. \"Can I afford a $45,000 car at $600/month?\"";
    }

    const result = canIAffordThis(
      {
        purchasePrice: purchasePrice ?? (monthlyPayment ?? 0) * 48,
        monthlyPayment: monthlyPayment ?? Math.round((purchasePrice ?? 0) / 48),
        downPayment: 0,
      },
      profile
    );

    return result.verdictSummary;
  }

  if (isDebtVsInvestingQuestion(q)) {
    const worstDebt = [...profile.liabilities].sort((a, b) => b.interestRate - a.interestRate)[0];
    if (!worstDebt) {
      return "You don't have any debt on file, so investing any extra cash is the clear move.";
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
    return `Putting ${formatCurrency(surplus)}/mo toward ${
      result.recommendation === "roughly_equal" ? "either" : verb
    } your ${worstDebt.label} (${formatPercent(worstDebt.interestRate / 100, 1)} APR) vs. investing it instead: over 10 years that's about ${formatCurrency(
      result.differenceAmount
    )} ${result.recommendation === "roughly_equal" ? "difference either way" : `better if you prioritize ${verb === "paying off" ? "debt" : "investing"}`}.`;
  }

  if (isHealthScoreQuestion(q)) {
    const health = calculateHealthScore(profile);
    return `Your Financial Health Score is ${health.overall}/100 — cash flow ${health.cashFlow}, debt ${health.debt}, savings ${health.savings}, investment ${health.investment}. ${
      health.overall >= 75 ? "You're in strong shape." : "There's clear room to improve — check your recommendations for the fastest wins."
    }`;
  }

  const [topRecommendation] = generateRecommendations(profile);
  if (topRecommendation) {
    return `I can help most with affordability questions, debt-vs-investing trade-offs, and your health score. In the meantime, your top recommendation right now: ${topRecommendation.description}`;
  }

  return "I can help with questions like \"Can I afford a $30,000 car?\", \"Should I pay off debt or invest?\", or \"How's my financial health?\" — ask me one of those.";
}
