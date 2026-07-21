import type { Goal } from "@/types/financial";
import type { GoalProjection } from "@/types/engine";

function monthsBetween(from: Date, to: Date): number {
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  return Math.max(1, months);
}

/** How much a goal needs per month to hit its target date, given progress so far. */
export function monthlyContributionNeeded(goal: Goal, today: Date = new Date()): number {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  if (remaining === 0) return 0;
  if (!goal.targetDate) return remaining; // no deadline -> "need it all now" is a reasonable upper bound
  const months = monthsBetween(today, new Date(goal.targetDate));
  return remaining / months;
}

/** Projected payoff date at the goal's current monthly contribution pace. */
export function projectedPayoffDate(goal: Goal, today: Date = new Date()): string | null {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  if (remaining === 0) return today.toISOString();
  if (goal.monthlyContribution <= 0) return null;

  const monthsNeeded = Math.ceil(remaining / goal.monthlyContribution);
  const projected = new Date(today);
  projected.setMonth(projected.getMonth() + monthsNeeded);
  return projected.toISOString();
}

export function projectGoal(goal: Goal, today: Date = new Date()): GoalProjection {
  const needed = monthlyContributionNeeded(goal, today);
  const payoffDate = projectedPayoffDate(goal, today);
  const onTrack = goal.monthlyContribution >= needed - 0.01;

  let monthsRemaining: number | null = null;
  if (goal.monthlyContribution > 0) {
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    monthsRemaining = remaining === 0 ? 0 : Math.ceil(remaining / goal.monthlyContribution);
  }

  return {
    goalId: goal.id,
    monthlyContributionNeeded: Math.round(needed * 100) / 100,
    projectedPayoffDate: payoffDate,
    onTrack,
    monthsRemaining,
  };
}

export function projectGoals(goals: Goal[], today: Date = new Date()): GoalProjection[] {
  return goals.map((goal) => projectGoal(goal, today));
}
