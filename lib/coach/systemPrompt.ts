import type { FinancialProfile } from "@/types/financial";
import type { FinancialPersonality } from "@/types/database.types";
import { formatCurrency, formatPercent } from "@/utils/formatters";

/**
 * The persona/behavior contract for Summora AI. Not consumed by the
 * deterministic engine below - that assembles its own copy directly, since
 * there's no model to steer with a prompt. This constant is the literal
 * seam a future real-LLM integration would use verbatim as its system
 * message (see answerCoachQuestion.ts), so it's written now rather than
 * deferred.
 */
export const COACH_SYSTEM_PROMPT = `You are Summora AI, a professional financial coach embedded in the Summora Systems app.

Your purpose is to help users make better financial decisions using their real financial data.

Rules:
- Always explain WHY, not just what.
- Always provide realistic, practical recommendations - prefer the achievable next step over the theoretical ideal.
- Do not shame users for their financial situation or past decisions.
- Break down complicated ideas into plain English.
- When discussing investing, explain the risks alongside the potential upside.
- If you make an assumption (an interest rate, a rule-of-thumb ratio, a growth rate), clearly identify it as an assumption.
- When useful, perform the calculation yourself rather than describing how to do it.
- Prioritize the user's long-term financial health over any single transaction.
- Never invent numbers that aren't in the user's data or a clearly-labeled assumption.`;

/**
 * Serializes the slice of FinancialProfile relevant to coaching into a
 * structured text block - the "personal context" the assistant should never
 * make the user repeat. This is the other half of the future-LLM seam:
 * `COACH_SYSTEM_PROMPT + buildCoachContext(profile, personality)` is exactly
 * what a real model call would send alongside conversation history.
 */
export function buildCoachContext(profile: FinancialProfile, personality: FinancialPersonality): string {
  const lines = [
    `Tone preference: ${personality} (coach = encouraging, analyst = data-heavy, minimal = just the essentials).`,
    `Monthly income: ${formatCurrency(profile.monthlyIncome)}`,
    `Monthly expenses: ${formatCurrency(profile.monthlyExpenses)}`,
    `Savings rate: ${formatPercent(profile.savingsRate)}`,
    `Total assets: ${formatCurrency(profile.totalAssets)}`,
    `Total liabilities: ${formatCurrency(profile.totalLiabilities)}`,
    `Emergency fund balance: ${formatCurrency(profile.emergencyFundBalance)}`,
    `Investment balance: ${formatCurrency(profile.totalInvestmentAssets)}`,
    `Liabilities: ${
      profile.liabilities.length
        ? profile.liabilities
            .map((l) => `${l.label} (${formatCurrency(l.balance)} at ${formatPercent(l.interestRate / 100, 1)} APR)`)
            .join("; ")
        : "none"
    }`,
    `Active goals: ${
      profile.goals.length
        ? profile.goals.map((g) => `${g.title} (${formatCurrency(g.currentAmount)} / ${formatCurrency(g.targetAmount)})`).join("; ")
        : "none"
    }`,
    `Expenses by category: ${Object.entries(profile.expensesByCategory)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => `${category}: ${formatCurrency(amount)}`)
      .join(", ")}`,
  ];

  return lines.join("\n");
}
