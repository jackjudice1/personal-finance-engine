"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMonthYear } from "@/utils/formatters";
import type { HealthScoreHistoryPoint } from "@/types/engine";

export function HealthScoreTrendChart({ history, overall }: { history: HealthScoreHistoryPoint[]; overall: number }) {
  const chartData = history.map((p) => ({ ...p, label: formatMonthYear(p.date) }));

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-baseline justify-between">
        <CardTitle>Health Score Trend</CardTitle>
        <span className="text-xl font-semibold tabular-nums">{overall}</span>
      </CardHeader>
      <CardContent className="h-48">
        {chartData.length < 2 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Check back tomorrow to see your score trend build up.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="healthScoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                formatter={(value) => `${value} / 100`}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="overall"
                stroke="var(--color-chart-3)"
                strokeWidth={2}
                fill="url(#healthScoreFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
