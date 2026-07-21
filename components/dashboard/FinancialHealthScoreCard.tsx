import type { HealthScoreBreakdown } from "@/types/engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { cn } from "@/lib/utils";

const OVERALL_SCORE_EXPLANATION =
  "The average of the four scores below (each worth 25%). It only moves as fast as your slowest-improving area — a great cash flow score can't make up for an empty emergency fund or no investments.";

const SUB_SCORES: { key: keyof Omit<HealthScoreBreakdown, "overall">; label: string; explanation: string }[] = [
  {
    key: "cashFlow",
    label: "Cash Flow",
    explanation:
      "Based on your savings rate — the share of income left after expenses. Saving 20%+ of your income scores 100; saving 0% scores 0.",
  },
  {
    key: "debt",
    label: "Debt",
    explanation:
      "Based on how much of your income goes to minimum debt payments. Under ~8% of income scores 100; 33%+ scores 0. Interest rates aren't factored in here directly — a separate recommendation flags high-APR debt.",
  },
  {
    key: "savings",
    label: "Savings",
    explanation:
      "Based on your emergency fund vs. 3 months of your expenses. Fully covering 3 months scores 100; no emergency fund scores 0.",
  },
  {
    key: "investment",
    label: "Investment",
    explanation:
      "Based on your investment + retirement balances vs. half a year's income. Investing half your annual income scores 100; $0 invested scores 0 — even with a huge income, this stays low until you actually hold investments.",
  },
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
        <CardTitle className="flex items-center gap-1.5">
          Financial Health Score
          <InfoTooltip text={OVERALL_SCORE_EXPLANATION} />
        </CardTitle>
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
                <span className="flex items-center gap-1 text-muted-foreground">
                  {sub.label}
                  <InfoTooltip text={sub.explanation} />
                </span>
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
