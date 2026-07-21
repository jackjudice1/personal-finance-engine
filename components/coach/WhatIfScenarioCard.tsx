"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FinancialProfile } from "@/types/financial";
import type { WhatIfScenarioConfig } from "@/types/coach";
import { runWhatIfScenario } from "@/lib/coach/whatIfScenarios";
import { SimulatorSliderPanel, type SliderConfig } from "@/components/simulators/SimulatorSliderPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency } from "@/utils/formatters";

export function WhatIfScenarioCard({ scenario, profile }: { scenario: WhatIfScenarioConfig; profile: FinancialProfile }) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(scenario.sliders.map((s) => [s.key, s.default]))
  );

  const result = useMemo(() => runWhatIfScenario(scenario, values, profile), [scenario, values, profile]);

  const sliders: SliderConfig[] = scenario.sliders.map((s) => ({
    key: s.key,
    label: s.label,
    min: s.min,
    max: s.max,
    step: s.step,
    value: values[s.key],
    onChange: (value) => setValues((prev) => ({ ...prev, [s.key]: value })),
    format: s.format === "years" ? (v) => `${v} yr` : (v) => `${v >= 0 ? "+" : ""}${formatCurrency(v)}`,
  }));

  const chartData = result.projection.map((point) => ({ year: point.year, "This scenario": point.netWorth }));

  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle className="text-sm">{scenario.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SimulatorSliderPanel sliders={sliders} />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Projected net worth</p>
          <p className="text-xl font-semibold tabular-nums">{formatCurrency(result.endingNetWorth)}</p>
          <p className="text-xs text-muted-foreground">vs. {formatCurrency(result.baselineEndingNetWorth)} at your current pace</p>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="year"
                tickFormatter={(v) => `Yr ${v}`}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCompactCurrency(v)}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={48}
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
              <Line type="monotone" dataKey="This scenario" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
