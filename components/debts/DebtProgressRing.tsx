import { cn, getUrgencyColor } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

export function DebtProgressRing({ progressPercent, totalEliminated }: { progressPercent: number; totalEliminated: number }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference * (1 - progressPercent / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex shrink-0 items-center justify-center">
        <svg viewBox="0 0 140 140" className="size-36 -rotate-90">
          <circle cx="70" cy="70" r="60" strokeWidth="10" className="fill-none stroke-muted" />
          <circle
            cx="70"
            cy="70"
            r="60"
            strokeWidth="10"
            strokeLinecap="round"
            className={cn("fill-none transition-all duration-700 ease-out", getUrgencyColor(progressPercent).replace("bg-", "stroke-"))}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-semibold tabular-nums">{Math.round(progressPercent)}%</span>
          <span className="text-xs text-muted-foreground">Debt Paid Off</span>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        You&apos;ve already eliminated <span className="font-medium text-foreground">{formatCurrency(totalEliminated)}</span> of debt.
      </p>
    </div>
  );
}
