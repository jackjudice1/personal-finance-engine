import type { FinancialProfile } from "@/types/financial";
import type { Recommendation } from "@/types/engine";
import { formatCurrency } from "@/utils/formatters";

/** Savings rate above which a user is considered ready to invest. */
const HEALTHY_SAVINGS_RATE = 0.15;
const HIGH_APR_THRESHOLD = 0.08;

export function evaluate(profile: FinancialProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const hasHighInterestDebt = profile.liabilities.some((l) => l.balance > 0 && l.interestRate / 100 > HIGH_APR_THRESHOLD);

  if (profile.savingsRate >= HEALTHY_SAVINGS_RATE && profile.totalInvestmentAssets === 0 && !hasHighInterestDebt) {
    const suggestedMonthly = Math.round(profile.monthlyIncome * profile.savingsRate * 0.5);
    recommendations.push({
      ruleId: "investing.start_investing",
      category: "investing",
      severity: "suggested",
      title: "You're ready to start investing",
      description: `Your savings rate is healthy and you have no high-interest debt. Consider directing ${formatCurrency(
        suggestedMonthly
      )}/mo toward a low-cost index fund.`,
      impactAmount: suggestedMonthly,
    });
  }

  return recommendations;
}
