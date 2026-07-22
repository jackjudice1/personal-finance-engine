import { Flame, Target, TrendingDown, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectDebtFreedom } from "@/lib/simulators/debtPayoff";
import type { Liability } from "@/types/financial";
import type { DebtFreedomSummary, PayoffStrategy } from "@/types/debt";
import { formatCurrency } from "@/utils/formatters";

interface Insight {
  icon: typeof Flame;
  text: string;
}

export function DebtInsights({
  debts,
  summary,
  strategy,
  extraMonthlyPayment,
  customOrder,
}: {
  debts: Liability[];
  summary: DebtFreedomSummary;
  strategy: PayoffStrategy;
  extraMonthlyPayment: number;
  customOrder: string[];
}) {
  const insights: Insight[] = [];

  const paidOffCount = debts.filter((d) => d.balance === 0).length;
  if (paidOffCount > 0) {
    insights.push({ icon: Trophy, text: `You've already paid off ${paidOffCount} of ${debts.length} debts.` });
  }

  const activeDebts = debts.filter((d) => d.balance > 0);
  const highestApr = [...activeDebts].sort((a, b) => b.interestRate - a.interestRate)[0];
  if (highestApr) {
    const monthlyInterestCost = Math.round(highestApr.balance * (highestApr.interestRate / 100 / 12));
    insights.push({
      icon: TrendingDown,
      text: `Your ${highestApr.label} is costing you ${formatCurrency(monthlyInterestCost)}/month in interest.`,
    });

    const highestAprProjection = summary.perDebt.find((p) => p.debtId === highestApr.id);
    if (highestAprProjection?.monthsRemaining !== null && highestAprProjection?.monthsRemaining !== undefined) {
      insights.push({
        icon: Target,
        text: `You're only ${highestAprProjection.monthsRemaining} months away from paying off your highest-interest debt.`,
      });
    }
  }

  if (activeDebts.length > 0) {
    const withMore = projectDebtFreedom(debts, strategy, extraMonthlyPayment + 100, customOrder);
    const interestSaved = Math.max(0, summary.totalInterestRemaining - withMore.totalInterestRemaining);
    if (interestSaved > 0) {
      insights.push({ icon: Flame, text: `Every extra $100/mo saves you ${formatCurrency(interestSaved)} in interest.` });
    }
  }

  if (extraMonthlyPayment > 0) {
    const baseline = projectDebtFreedom(debts, strategy, 0, customOrder);
    if (baseline.totalMonthsRemaining !== null && summary.totalMonthsRemaining !== null) {
      const monthsAhead = baseline.totalMonthsRemaining - summary.totalMonthsRemaining;
      if (monthsAhead > 0) {
        insights.push({ icon: Flame, text: `You're ${monthsAhead} months ahead of your minimum-only pace.` });
      }
    }
  }

  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2.5 text-sm">
            <insight.icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>{insight.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
