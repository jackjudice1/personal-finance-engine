"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { FinancialProfile } from "@/types/financial";
import { whatIf } from "@/lib/simulators/whatIf";
import { SimulatorSliderPanel, type SliderConfig } from "@/components/simulators/SimulatorSliderPanel";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency } from "@/utils/formatters";

export function WhatIfSimulator({ profile }: { profile: FinancialProfile }) {
  const [monthlyIncomeDelta, setMonthlyIncomeDelta] = useState(0);
  const [monthlyExpensesDelta, setMonthlyExpensesDelta] = useState(0);
  const [extraMonthlyInvestment, setExtraMonthlyInvestment] = useState(200);
  const [extraMonthlyDebtPayment, setExtraMonthlyDebtPayment] = useState(0);
  const [horizonYears, setHorizonYears] = useState(15);

  const result = useMemo(
    () =>
      whatIf(
        { monthlyIncomeDelta, monthlyExpensesDelta, extraMonthlyInvestment, extraMonthlyDebtPayment, horizonYears },
        profile
      ),
    [monthlyIncomeDelta, monthlyExpensesDelta, extraMonthlyInvestment, extraMonthlyDebtPayment, horizonYears, profile]
  );

  const sliders: SliderConfig[] = [
    {
      key: "monthlyIncomeDelta",
      label: "Monthly income change",
      min: -2000,
      max: 5000,
      step: 100,
      value: monthlyIncomeDelta,
      onChange: setMonthlyIncomeDelta,
      format: (v) => `${v >= 0 ? "+" : ""}${formatCurrency(v)}`,
    },
    {
      key: "monthlyExpensesDelta",
      label: "Monthly expenses change",
      min: -2000,
      max: 3000,
      step: 100,
      value: monthlyExpensesDelta,
      onChange: setMonthlyExpensesDelta,
      format: (v) => `${v >= 0 ? "+" : ""}${formatCurrency(v)}`,
    },
    {
      key: "extraMonthlyInvestment",
      label: "Extra monthly investment",
      min: 0,
      max: 3000,
      step: 50,
      value: extraMonthlyInvestment,
      onChange: setExtraMonthlyInvestment,
      format: formatCurrency,
    },
    {
      key: "extraMonthlyDebtPayment",
      label: "Extra monthly debt payment",
      min: 0,
      max: 2000,
      step: 50,
      value: extraMonthlyDebtPayment,
      onChange: setExtraMonthlyDebtPayment,
      format: formatCurrency,
    },
    {
      key: "horizonYears",
      label: "Time horizon",
      min: 1,
      max: 40,
      step: 1,
      value: horizonYears,
      onChange: setHorizonYears,
      format: (v) => `${v} yr`,
    },
  ];

  const chartData = result.projection.map((point) => ({
    year: point.year,
    "This scenario": point.netWorth,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <SimulatorSliderPanel sliders={sliders} />
        <Card>
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Net worth in {horizonYears} years</p>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(result.endingNetWorth)}</p>
            <p className="text-xs text-muted-foreground">
              vs. {formatCurrency(result.baselineEndingNetWorth)} at your current pace with no changes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="year"
                tickFormatter={(v) => `Yr ${v}`}
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
              <Line type="monotone" dataKey="This scenario" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
