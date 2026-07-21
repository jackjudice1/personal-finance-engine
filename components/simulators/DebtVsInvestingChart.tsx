"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { debtVsInvesting } from "@/lib/simulators/debtVsInvesting";
import { SimulatorSliderPanel, type SliderConfig } from "@/components/simulators/SimulatorSliderPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/utils/formatters";

const RECOMMENDATION_LABEL = {
  pay_debt_first: "Pay off debt first",
  invest_first: "Invest first",
  roughly_equal: "Roughly a wash",
} as const;

export function DebtVsInvestingChart() {
  const [extraMonthlyAmount, setExtraMonthlyAmount] = useState(400);
  const [debtInterestRate, setDebtInterestRate] = useState(20);
  const [debtBalance, setDebtBalance] = useState(5000);
  const [expectedInvestmentReturn, setExpectedInvestmentReturn] = useState(7);
  const [horizonYears, setHorizonYears] = useState(10);

  const result = useMemo(
    () => debtVsInvesting({ extraMonthlyAmount, debtInterestRate, debtBalance, expectedInvestmentReturn, horizonYears }),
    [extraMonthlyAmount, debtInterestRate, debtBalance, expectedInvestmentReturn, horizonYears]
  );

  const sliders: SliderConfig[] = [
    {
      key: "extraMonthlyAmount",
      label: "Extra monthly amount",
      min: 50,
      max: 2000,
      step: 50,
      value: extraMonthlyAmount,
      onChange: setExtraMonthlyAmount,
      format: formatCurrency,
    },
    {
      key: "debtBalance",
      label: "Debt balance",
      min: 500,
      max: 50000,
      step: 500,
      value: debtBalance,
      onChange: setDebtBalance,
      format: formatCurrency,
    },
    {
      key: "debtInterestRate",
      label: "Debt APR",
      min: 1,
      max: 30,
      step: 0.5,
      value: debtInterestRate,
      onChange: setDebtInterestRate,
      format: (v) => formatPercent(v / 100, 1),
    },
    {
      key: "expectedInvestmentReturn",
      label: "Expected investment return",
      min: 1,
      max: 12,
      step: 0.5,
      value: expectedInvestmentReturn,
      onChange: setExpectedInvestmentReturn,
      format: (v) => formatPercent(v / 100, 1),
    },
    {
      key: "horizonYears",
      label: "Time horizon",
      min: 1,
      max: 30,
      step: 1,
      value: horizonYears,
      onChange: setHorizonYears,
      format: (v) => `${v} yr`,
    },
  ];

  const chartData = [
    { name: "Pay debt first", value: result.payDebtFirstNetWorth },
    { name: "Invest first", value: result.investFirstNetWorth },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SimulatorSliderPanel sliders={sliders} />

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Net worth after {horizonYears} years</p>
            <Badge>{RECOMMENDATION_LABEL[result.recommendation]}</Badge>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
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
                <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground">
            Difference: {formatCurrency(result.differenceAmount)} in favor of{" "}
            {result.recommendation === "roughly_equal" ? "neither" : RECOMMENDATION_LABEL[result.recommendation].toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
