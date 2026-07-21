import type { HealthScoreBreakdown } from "@/types/engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SUB_SCORES: { key: keyof Omit<HealthScoreBreakdown, "overall">; label: string }[] = [
  { key: "cashFlow", label: "Cash Flow" },
  { key: "debt", label: "Debt" },
  { key: "savings", label: "Savings" },
  { key: "investment", label: "Investment" },
];

function scoreColor(score: number) {
  if (score >= 70) return "bg-primary";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function FinancialHealthScoreCard({ health }: { health: HealthScoreBreakdown }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - health.overall / 100);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative flex shrink-0 items-center justify-center">
          <svg viewBox="0 0 100 100" className="size-28 -rotate-90">
            <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-muted" />
            <circle
              cx="50"
              cy="50"
              r="42"
              strokeWidth="8"
              strokeLinecap="round"
              className={cn("fill-none transition-all", scoreColor(health.overall).replace("bg-", "stroke-"))}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-semibold tabular-nums">{health.overall}</span>
            <span className="text-[11px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {SUB_SCORES.map((sub) => (
            <div key={sub.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{sub.label}</span>
                <span className="font-medium tabular-nums">{health[sub.key]}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", scoreColor(health[sub.key]))}
                  style={{ width: `${health[sub.key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
