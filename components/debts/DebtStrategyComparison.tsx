"use client";

import { useMemo } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ArrowDown, ArrowUp, Trophy } from "lucide-react";
import type { Liability } from "@/types/financial";
import type { DebtFreedomSummary, PayoffStrategy } from "@/types/debt";
import { projectDebtFreedom } from "@/lib/simulators/debtPayoff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/formatters";

const STRATEGY_LABELS: Record<PayoffStrategy, string> = {
  avalanche: "Avalanche",
  snowball: "Snowball",
  custom: "Custom",
};

function StrategyStats({
  summary,
  baseline,
  isWinner,
}: {
  summary: DebtFreedomSummary;
  baseline: DebtFreedomSummary;
  isWinner: boolean;
}) {
  const interestSaved = Math.max(0, baseline.totalInterestRemaining - summary.totalInterestRemaining);
  const monthsSaved =
    baseline.totalMonthsRemaining !== null && summary.totalMonthsRemaining !== null
      ? Math.max(0, baseline.totalMonthsRemaining - summary.totalMonthsRemaining)
      : null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p className="text-xs text-muted-foreground">Debt-Free Date</p>
        <p className="font-semibold tabular-nums">{summary.debtFreeDate ? formatDate(summary.debtFreeDate) : "—"}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Total Interest Paid</p>
        <p className="font-semibold tabular-nums">{formatCurrency(summary.totalInterestRemaining)}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Interest Saved</p>
        <p className="flex items-center gap-1 font-semibold tabular-nums text-primary">
          {formatCurrency(interestSaved)}
          {isWinner && <Trophy className="size-3.5" />}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Time Saved</p>
        <p className="font-semibold tabular-nums">{monthsSaved !== null ? `${monthsSaved} mo` : "—"}</p>
      </div>
    </div>
  );
}

export function DebtStrategyComparison({
  debts,
  extraMonthlyPayment,
  strategy,
  onStrategyChange,
  customOrder,
  onCustomOrderChange,
}: {
  debts: Liability[];
  extraMonthlyPayment: number;
  strategy: PayoffStrategy;
  onStrategyChange: (strategy: PayoffStrategy) => void;
  customOrder: string[];
  onCustomOrderChange: (order: string[]) => void;
}) {
  const baseline = useMemo(() => projectDebtFreedom(debts, "avalanche", 0), [debts]);
  const avalanche = useMemo(() => projectDebtFreedom(debts, "avalanche", extraMonthlyPayment), [debts, extraMonthlyPayment]);
  const snowball = useMemo(() => projectDebtFreedom(debts, "snowball", extraMonthlyPayment), [debts, extraMonthlyPayment]);
  const custom = useMemo(
    () => projectDebtFreedom(debts, "custom", extraMonthlyPayment, customOrder),
    [debts, extraMonthlyPayment, customOrder]
  );

  const debtsById = new Map(debts.map((d) => [d.id, d]));
  const lowestInterest = Math.min(
    avalanche.totalInterestRemaining,
    snowball.totalInterestRemaining,
    custom.totalInterestRemaining
  );

  const chartData = avalanche.balanceOverTime.map((point, i) => ({
    month: point.month,
    Avalanche: point.totalBalance,
    Snowball: snowball.balanceOverTime[i]?.totalBalance ?? null,
    Custom: custom.balanceOverTime[i]?.totalBalance ?? null,
  }));

  function moveInCustomOrder(debtId: string, direction: -1 | 1) {
    const index = customOrder.indexOf(debtId);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= customOrder.length) return;
    const next = [...customOrder];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onCustomOrderChange(next);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payoff Strategies</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={strategy} onValueChange={(value) => onStrategyChange(value as PayoffStrategy)}>
          <TabsList>
            {(Object.keys(STRATEGY_LABELS) as PayoffStrategy[]).map((key) => (
              <TabsTrigger key={key} value={key}>
                {STRATEGY_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="avalanche" className="space-y-4 pt-4">
            <StrategyStats summary={avalanche} baseline={baseline} isWinner={avalanche.totalInterestRemaining === lowestInterest} />
          </TabsContent>
          <TabsContent value="snowball" className="space-y-4 pt-4">
            <StrategyStats summary={snowball} baseline={baseline} isWinner={snowball.totalInterestRemaining === lowestInterest} />
          </TabsContent>
          <TabsContent value="custom" className="space-y-4 pt-4">
            <StrategyStats summary={custom} baseline={baseline} isWinner={custom.totalInterestRemaining === lowestInterest} />
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Attack order (extra payments go here first):</p>
              {customOrder.map((debtId, index) => {
                const debt = debtsById.get(debtId);
                if (!debt) return null;
                return (
                  <div key={debtId} className="flex items-center justify-between gap-2 rounded-lg bg-accent px-3 py-1.5 text-sm">
                    <span>
                      {index + 1}. {debt.label}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={index === 0}
                        onClick={() => moveInCustomOrder(debtId, -1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={index === customOrder.length - 1}
                        onClick={() => moveInCustomOrder(debtId, 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={(v) => `Mo ${v}`}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCompactCurrency(v)}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Avalanche" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Snowball" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Custom" stroke="var(--color-premium)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
