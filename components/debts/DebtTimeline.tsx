import { CheckCircle2, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DebtFreedomSummary } from "@/types/debt";
import type { Liability } from "@/types/financial";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function DebtTimeline({ summary, debts }: { summary: DebtFreedomSummary; debts: Liability[] }) {
  const debtsById = new Map(debts.map((d) => [d.id, d]));
  const sorted = [...summary.perDebt].sort((a, b) => {
    if (a.monthsRemaining === null && b.monthsRemaining === null) return 0;
    if (a.monthsRemaining === null) return 1;
    if (b.monthsRemaining === null) return -1;
    return a.monthsRemaining - b.monthsRemaining;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payoff Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="flex items-center gap-3 pb-4 text-sm font-medium">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
            •
          </div>
          Today
        </div>

        {sorted.map((projection) => {
          const debt = debtsById.get(projection.debtId);
          if (!debt) return null;
          const isDone = debt.balance === 0;
          const progressPercent =
            debt.originalBalance > 0
              ? Math.min(100, Math.max(0, ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100))
              : 100;

          return (
            <div key={projection.debtId} className="flex gap-3 border-l-2 border-border/60 pb-4 pl-4 last:border-transparent">
              <div className="-ml-[1.65rem] flex size-6 shrink-0 items-center justify-center rounded-full bg-background">
                {isDone ? (
                  <CheckCircle2 className="size-5 text-primary" />
                ) : (
                  <div className="size-2.5 rounded-full bg-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <p className="text-sm font-medium">{debt.label}</p>
                <p className="text-xs text-muted-foreground">
                  {isDone
                    ? "Paid off"
                    : projection.payoffDate
                      ? `Est. payoff ${formatDate(projection.payoffDate)} — ${formatCurrency(debt.balance)} remaining, ${projection.monthsRemaining} mo`
                      : "Won't pay off at current payments"}
                </p>
                <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex items-center gap-3 pt-1 text-sm font-medium text-primary">
          <PartyPopper className="size-5 shrink-0" />
          Debt Free{summary.debtFreeDate ? ` — ${formatDate(summary.debtFreeDate)}` : ""}
        </div>
      </CardContent>
    </Card>
  );
}
