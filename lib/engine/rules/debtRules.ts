import type { FinancialProfile } from "@/types/financial";
import type { Recommendation } from "@/types/engine";
import { formatCurrency, formatPercent } from "@/utils/formatters";

/** APR above which debt is considered "high interest" — worth paying down before investing. */
const HIGH_APR_THRESHOLD = 0.08;
/** APR above which the recommendation is urgent rather than merely suggested. */
const URGENT_APR_THRESHOLD = 0.15;

export function evaluate(profile: FinancialProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const highInterestDebts = profile.liabilities
    .filter((l) => l.balance > 0 && l.interestRate / 100 > HIGH_APR_THRESHOLD)
    .sort((a, b) => b.interestRate - a.interestRate);

  if (highInterestDebts.length > 0 && profile.totalInvestmentAssets > 0) {
    const worst = highInterestDebts[0];
    const severity = worst.interestRate / 100 > URGENT_APR_THRESHOLD ? "urgent" : "suggested";
    recommendations.push({
      ruleId: "debt.payoff_before_invest",
      category: "debt",
      severity,
      title: `Pay off your ${worst.label} before increasing investments`,
      description: `Your ${worst.label} balance of ${formatCurrency(worst.balance)} carries ${formatPercent(
        worst.interestRate / 100,
        2
      )} APR — that's costing more than any realistic investment return.`,
      impactAmount: worst.balance,
    });
  } else if (highInterestDebts.length > 0) {
    const worst = highInterestDebts[0];
    recommendations.push({
      ruleId: "debt.high_interest_priority",
      category: "debt",
      severity: worst.interestRate / 100 > URGENT_APR_THRESHOLD ? "urgent" : "suggested",
      title: `Prioritize paying off your ${worst.label}`,
      description: `At ${formatPercent(worst.interestRate / 100, 2)} APR, this is your most expensive debt. Extra payments here beat almost any other use of spare cash.`,
      impactAmount: worst.balance,
    });
  }

  return recommendations;
}
