import type { FinancialProfile } from "@/types/financial";
import type { Recommendation } from "@/types/engine";
import { formatCurrency } from "@/utils/formatters";

/** Housing spend above this share of income is flagged as stretched. */
const HOUSING_STRETCHED_RATIO = 0.32;
/** Housing spend below this share, combined with a healthy savings rate, means there's room to spend more. */
const HOUSING_COMFORTABLE_RATIO = 0.22;
const HEALTHY_SAVINGS_RATE_FOR_UPGRADE = 0.25;

export function evaluate(profile: FinancialProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];
  if (profile.monthlyIncome <= 0) return recommendations;

  const housingSpend = profile.expensesByCategory.housing ?? 0;
  const housingRatio = housingSpend / profile.monthlyIncome;

  if (housingRatio > HOUSING_STRETCHED_RATIO) {
    recommendations.push({
      ruleId: "cash_flow.housing_stretched",
      category: "cash_flow",
      severity: housingRatio > 0.4 ? "urgent" : "suggested",
      title: "Housing is taking up more than a third of your income",
      description: `Housing costs are ${(housingRatio * 100).toFixed(
        0
      )}% of your monthly income, above the typical 30% guideline. This is squeezing your ability to save and invest.`,
      impactAmount: housingSpend,
    });
  } else if (housingRatio < HOUSING_COMFORTABLE_RATIO && profile.savingsRate > HEALTHY_SAVINGS_RATE_FOR_UPGRADE) {
    const room = Math.round((HOUSING_COMFORTABLE_RATIO - housingRatio) * profile.monthlyIncome * 0.6);
    if (room >= 50) {
      recommendations.push({
        ruleId: "cash_flow.housing_room_available",
        category: "cash_flow",
        severity: "info",
        title: `You can safely increase your monthly housing budget by ${formatCurrency(room)}`,
        description: "Your savings rate is healthy enough to absorb a higher housing cost without derailing your goals.",
        impactAmount: room,
      });
    }
  }

  return recommendations;
}
