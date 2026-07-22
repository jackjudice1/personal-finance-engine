"use client";

import { useMemo } from "react";
import { Area, AreaChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Liability } from "@/types/financial";
import type { DebtPaymentPoint } from "@/hooks/useDebtPaymentHistory";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/formatters";

const PIE_COLORS = ["var(--color-primary)", "var(--color-warning)", "var(--color-premium)", "var(--color-secondary)", "var(--color-destructive)"];

function InterestPaidOverTimeChart({
  debts,
  paymentsByDebt,
}: {
  debts: Liability[];
  paymentsByDebt: Record<string, DebtPaymentPoint[]>;
}) {
  const debtsById = new Map(debts.map((d) => [d.id, d]));

  const chartData = useMemo(() => {
    const allPayments = Object.entries(paymentsByDebt).flatMap(([debtId, payments]) =>
      payments.map((p) => ({ ...p, debtId }))
    );
    allPayments.sort((a, b) => a.paidAt.localeCompare(b.paidAt));

    let cumulativeInterest = 0;
    return allPayments.map((payment) => {
      const debt = debtsById.get(payment.debtId);
      const monthlyRate = debt ? debt.interestRate / 100 / 12 : 0;
      const balanceBefore = payment.balanceAfter + payment.amount;
      const interestPortion = Math.min(balanceBefore * monthlyRate, payment.amount);
      cumulativeInterest += interestPortion;
      return { label: formatDate(payment.paidAt), cumulativeInterest: Math.round(cumulativeInterest * 100) / 100 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsByDebt]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Interest Paid Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-48">
        {chartData.length < 2 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Log a couple payments to see this build up.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="interestPaidFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
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
                contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="cumulativeInterest" stroke="var(--color-warning)" strokeWidth={2} fill="url(#interestPaidFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function MonthlyPaymentAllocationChart({ debts }: { debts: Liability[] }) {
  const activeDebts = debts.filter((d) => d.balance > 0 && d.minimumPayment > 0);
  const chartData = activeDebts.map((d) => ({ name: d.label, value: d.minimumPayment }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Monthly Payment Allocation</CardTitle>
      </CardHeader>
      <CardContent className="h-48">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            No minimum payments set yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function DebtHistoryCharts({
  debts,
  paymentsByDebt,
}: {
  debts: Liability[];
  paymentsByDebt: Record<string, DebtPaymentPoint[]>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <InterestPaidOverTimeChart debts={debts} paymentsByDebt={paymentsByDebt} />
      <MonthlyPaymentAllocationChart debts={debts} />
    </div>
  );
}
