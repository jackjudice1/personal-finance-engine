"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency, formatMonthYear } from "@/utils/formatters";
import type { DebtPaymentPoint } from "@/hooks/useDebtPaymentHistory";

export function DebtPayoffChart({ history, currentBalance }: { history: DebtPaymentPoint[]; currentBalance: number }) {
  const chartData = history.map((p) => ({ ...p, label: formatMonthYear(p.paidAt) }));

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-baseline justify-between">
        <CardTitle>Payoff progress</CardTitle>
        <span className="text-xl font-semibold tabular-nums">{formatCurrency(currentBalance)}</span>
      </CardHeader>
      <CardContent className="h-48">
        {chartData.length < 2 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Log a couple payments to see your payoff trend build up.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="debtPayoffFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
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
              <Area
                type="monotone"
                dataKey="balanceAfter"
                stroke="var(--color-destructive)"
                strokeWidth={2}
                fill="url(#debtPayoffFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
