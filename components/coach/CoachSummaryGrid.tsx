import { Activity, Banknote, CreditCard, PiggyBank, ShieldCheck, Target, TrendingUp, Wallet } from "lucide-react";
import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown } from "@/types/engine";
import { calculateNetWorth } from "@/lib/engine/netWorth";
import { projectGoal } from "@/lib/engine/goalProjections";
import { MoneySnapshotCard } from "@/components/dashboard/MoneySnapshotCard";
import { CoachProgressCard } from "@/components/coach/CoachProgressCard";
import { formatCurrency, formatPercent } from "@/utils/formatters";

export function CoachSummaryGrid({ profile, health }: { profile: FinancialProfile; health: HealthScoreBreakdown }) {
  const netWorth = calculateNetWorth(profile);
  const monthlyCashFlow = profile.monthlyIncome - profile.monthlyExpenses;
  const topGoal = [...profile.goals].sort((a, b) => a.priority - b.priority)[0];
  const topGoalProjection = topGoal ? projectGoal(topGoal) : null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <CoachProgressCard
        icon={Activity}
        label="Financial Health Score"
        value={`${health.overall}/100`}
        percent={health.overall}
        detail="Weighted equally across cash flow, debt, savings, and investing."
      />
      <MoneySnapshotCard icon={Wallet} label="Net Worth" value={formatCurrency(netWorth.netWorth)} />
      <MoneySnapshotCard icon={TrendingUp} label="Monthly Cash Flow" value={formatCurrency(monthlyCashFlow)} />
      <MoneySnapshotCard icon={PiggyBank} label="Savings Rate" value={formatPercent(profile.savingsRate)} />
      <CoachProgressCard
        icon={ShieldCheck}
        label="Emergency Fund"
        value={formatCurrency(health.details.savings.currentValue)}
        percent={health.details.savings.score}
        detail={health.details.savings.why}
      />
      <CoachProgressCard
        icon={CreditCard}
        label="Debt Health"
        value={formatPercent(health.details.debt.currentValue)}
        percent={health.details.debt.score}
        detail={health.details.debt.why}
      />
      <MoneySnapshotCard icon={Banknote} label="Monthly Debt Payments" value={formatCurrency(profile.totalMinimumPayments)} />
      {topGoal && topGoalProjection ? (
        <CoachProgressCard
          icon={Target}
          label={topGoal.title}
          value={formatCurrency(topGoal.currentAmount)}
          percent={(topGoal.currentAmount / Math.max(topGoal.targetAmount, 1)) * 100}
          detail={
            topGoalProjection.onTrack
              ? `On track — ${formatCurrency(topGoal.targetAmount)} target.`
              : `Behind pace — needs ${formatCurrency(topGoalProjection.monthlyContributionNeeded)}/mo to hit ${formatCurrency(
                  topGoal.targetAmount
                )}.`
          }
        />
      ) : (
        <MoneySnapshotCard icon={Target} label="Top Goal" value="None set" description="Add a goal in Goals to see it here." />
      )}
    </div>
  );
}
