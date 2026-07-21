import type { FinancialProfile } from "@/types/financial";
import type { Recommendation } from "@/types/engine";
import { monthlyContributionNeeded } from "@/lib/engine/goalProjections";
import { formatCurrency } from "@/utils/formatters";

export function evaluate(profile: FinancialProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const goal of profile.goals) {
    if (goal.status !== "active" || !goal.targetDate) continue;

    const needed = monthlyContributionNeeded(goal);
    const shortfall = needed - goal.monthlyContribution;

    if (shortfall > 10) {
      recommendations.push({
        ruleId: "goal.behind_pace",
        category: "goal",
        severity: shortfall / Math.max(needed, 1) > 0.5 ? "suggested" : "info",
        title: `Increase your "${goal.title}" contribution by ${formatCurrency(shortfall)}/mo to stay on track`,
        description: `At your current pace of ${formatCurrency(goal.monthlyContribution)}/mo, you'll miss your target date. ${formatCurrency(
          needed
        )}/mo keeps you on schedule.`,
        impactAmount: shortfall,
        relatedGoalId: goal.id,
      });
    }
  }

  return recommendations;
}
