import type { FinancialProfile } from "@/types/financial";
import type { CanIAffordThisInput, CanIAffordThisResult } from "@/types/engine";
import { formatCurrency } from "@/utils/formatters";

/** Savings rate below which a purchase is flagged as not comfortably affordable. */
const MIN_COMFORTABLE_SAVINGS_RATE = 0.05;

export function canIAffordThis(input: CanIAffordThisInput, profile: FinancialProfile): CanIAffordThisResult {
  const { monthlyPayment, downPayment } = input;

  const liquidAssets = profile.assets
    .filter((a) => a.type === "savings" || a.type === "checking")
    .reduce((sum, a) => sum + a.balance, 0);

  const newSurplus = profile.monthlyIncome - profile.monthlyExpenses - monthlyPayment;
  const newSavingsRate = profile.monthlyIncome > 0 ? newSurplus / profile.monthlyIncome : 0;

  const canCoverDownPayment = downPayment <= liquidAssets;
  const affordable = canCoverDownPayment && newSavingsRate >= MIN_COMFORTABLE_SAVINGS_RATE;

  // Reallocating monthlyPayment away from goal contributions, proportional to
  // each goal's current share of total contributions - a simplifying
  // assumption for an illustrative estimate, not a literal budget rule.
  const totalCurrentContributions = profile.goals.reduce((sum, g) => sum + g.monthlyContribution, 0);

  const monthsDelayedPerGoal = profile.goals
    .filter((g) => g.monthlyContribution > 0 && g.status === "active")
    .map((goal) => {
      const share = totalCurrentContributions > 0 ? goal.monthlyContribution / totalCurrentContributions : 0;
      const reduction = monthlyPayment * share;
      const newContribution = Math.max(0, goal.monthlyContribution - reduction);
      const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

      const originalMonths = remaining / goal.monthlyContribution;
      const newMonths = newContribution > 0 ? remaining / newContribution : Infinity;
      const monthsDelayed = Number.isFinite(newMonths) ? Math.round(newMonths - originalMonths) : 999;

      return { goalId: goal.id, goalTitle: goal.title, monthsDelayed };
    })
    .filter((g) => g.monthsDelayed > 0);

  let verdictSummary: string;
  if (!canCoverDownPayment) {
    verdictSummary = `You'd need ${formatCurrency(downPayment)} up front but only have ${formatCurrency(
      liquidAssets
    )} in liquid savings.`;
  } else if (affordable) {
    verdictSummary = `This fits comfortably — your savings rate stays at ${(newSavingsRate * 100).toFixed(
      0
    )}% afterward.`;
  } else {
    const worstDelay = monthsDelayedPerGoal.sort((a, b) => b.monthsDelayed - a.monthsDelayed)[0];
    verdictSummary = worstDelay
      ? `This would delay "${worstDelay.goalTitle}" by about ${worstDelay.monthsDelayed} months and drop your savings rate to ${(
          newSavingsRate * 100
        ).toFixed(0)}%.`
      : `This would drop your savings rate to ${(newSavingsRate * 100).toFixed(0)}%, below a comfortable buffer.`;
  }

  return { affordable, newSavingsRate, monthsDelayedPerGoal, verdictSummary };
}
