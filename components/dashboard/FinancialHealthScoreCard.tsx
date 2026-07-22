import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HealthScoreBreakdown, HealthScoreSubKey } from "@/types/engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { cn, getUrgencyColor } from "@/lib/utils";

const OVERALL_SCORE_EXPLANATION =
  "The average of the four scores below (each worth 25%). It only moves as fast as your slowest-improving area — a great cash flow score can't make up for an empty emergency fund or no investments.";

const SUB_SCORES: { key: HealthScoreSubKey; label: string; explanation: string }[] = [
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
      <CardContent className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="relative flex shrink-0 items-center justify-center">
            <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
              <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-muted" />
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth="8"
                strokeLinecap="round"
                className={cn("fill-none transition-all", getUrgencyColor(health.overall).replace("bg-", "stroke-"))}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-semibold tabular-nums">{health.overall}</span>
              <span className="text-[11px] text-muted-foreground">/ 100</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Weighted equally across cash flow, debt, savings, and investing. Each row below shows your real numbers,
            not just the score.
          </p>
        </div>

        <div className="space-y-5">
          {SUB_SCORES.map((sub) => {
            const detail = health.details[sub.key];
            return (
              <div key={sub.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-medium">
                    {sub.label}
                    <InfoTooltip text={sub.explanation} />
                  </span>
                  <span className="font-medium tabular-nums">{detail.score}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", getUrgencyColor(detail.score))}
                    style={{ width: `${detail.score}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="text-xs text-muted-foreground">{detail.why}</p>
                  {detail.action && (
                    <Link
                      href={detail.action.href}
                      className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary hover:underline"
                    >
                      {detail.action.label}
                      <ArrowRight className="size-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
