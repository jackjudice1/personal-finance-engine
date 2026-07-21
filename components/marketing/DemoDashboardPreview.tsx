import { AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { demoGoals, demoHealthScore, demoNetWorthTrend, demoRecommendations, demoSnapshot } from "@/utils/mockData";

const SEVERITY_ICON = { urgent: AlertTriangle, suggested: TrendingUp, info: Info };
const SEVERITY_COLOR = {
  urgent: "text-destructive",
  suggested: "text-primary",
  info: "text-muted-foreground",
};

export function DemoDashboardPreview() {
  const maxNetWorth = Math.max(...demoNetWorthTrend.map((p) => p.netWorth));
  const circumference = 2 * Math.PI * 42;
  const scoreOffset = circumference * (1 - demoHealthScore.overall / 100);

  return (
    <Card className="border-border/60 bg-card/60 text-left shadow-2xl shadow-black/20 backdrop-blur">
      <CardContent className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
        {/* Health score */}
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-4 sm:col-span-1">
          <svg viewBox="0 0 100 100" className="size-20 shrink-0 -rotate-90">
            <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-muted" />
            <circle
              cx="50"
              cy="50"
              r="42"
              strokeWidth="8"
              strokeLinecap="round"
              className="fill-none stroke-primary"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
            />
          </svg>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{demoHealthScore.overall}</p>
            <p className="text-xs text-muted-foreground">Financial Health Score</p>
          </div>
        </div>

        {/* Net worth trend */}
        <div className="rounded-xl border border-border/60 bg-background/40 p-4 sm:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-xs text-muted-foreground">Net Worth</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrency(demoNetWorthTrend[demoNetWorthTrend.length - 1].netWorth)}
            </p>
          </div>
          <div className="flex h-16 items-end gap-2">
            {demoNetWorthTrend.map((point) => (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-primary/70"
                  style={{ height: `${(point.netWorth / maxNetWorth) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{point.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Snapshot cards */}
        <div className="grid grid-cols-2 gap-3 sm:col-span-3 sm:grid-cols-4">
          {[
            { label: "Monthly Income", value: formatCurrency(demoSnapshot.monthlyIncome) },
            { label: "Savings Rate", value: formatPercent(demoSnapshot.savingsRate) },
            { label: "Debt Remaining", value: formatCurrency(demoSnapshot.debtRemaining) },
            { label: "Investments", value: formatCurrency(demoSnapshot.investmentBalance) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
              <p className="text-base font-semibold tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Top recommendation */}
        <div className="sm:col-span-3">
          {demoRecommendations.slice(0, 1).map((rec) => {
            const Icon = SEVERITY_ICON[rec.severity];
            return (
              <div
                key={rec.title}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-4"
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${SEVERITY_COLOR[rec.severity]}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {rec.severity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden text-xs text-muted-foreground sm:col-span-3 sm:block">
          {demoGoals.length} active goals tracked · illustrative data
        </div>
      </CardContent>
    </Card>
  );
}
