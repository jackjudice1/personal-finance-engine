import type { FinancialProfile } from "@/types/financial";
import type { Recommendation } from "@/types/engine";
import { formatCurrency } from "@/utils/formatters";

const TARGET_MONTHS_EXPENSES = 3;

export function evaluate(profile: FinancialProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const target = profile.monthlyExpenses * TARGET_MONTHS_EXPENSES;

  if (target <= 0) return recommendations;

  const ratio = profile.emergencyFundBalance / target;

  if (ratio < 1) {
    const remaining = target - profile.emergencyFundBalance;
    recommendations.push({
      ruleId: "savings.emergency_fund_below_target",
      category: "savings",
      severity: ratio < 0.34 ? "urgent" : "suggested",
      title: "Your emergency fund is below your recommended target",
      description: `You're at ${formatCurrency(profile.emergencyFundBalance)} of a ${formatCurrency(
        target
      )} target (${TARGET_MONTHS_EXPENSES} months of expenses). ${formatCurrency(remaining)} to go.`,
      impactAmount: remaining,
    });
  }

  return recommendations;
}
