import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebtProgressRing } from "@/components/debts/DebtProgressRing";
import { DebtCountdown } from "@/components/debts/DebtCountdown";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { DebtFreedomSummary } from "@/types/debt";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function DebtFreedomCountdown({ summary }: { summary: DebtFreedomSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Debt Freedom Countdown</CardTitle>
        <p className="text-sm text-muted-foreground">See exactly when you&apos;ll become debt-free.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
          <DebtProgressRing progressPercent={summary.overallProgressPercent} totalEliminated={summary.totalEliminated} />
          <div className="space-y-5">
            <DebtCountdown debtFreeDate={summary.debtFreeDate} />
            <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4 sm:grid-cols-3">
              <Stat label="Debt-Free Date" value={summary.debtFreeDate ? formatDate(summary.debtFreeDate) : "—"} />
              <Stat label="Remaining Balance" value={formatCurrency(summary.totalBalanceRemaining)} />
              <Stat label="Interest Remaining" value={formatCurrency(summary.totalInterestRemaining)} />
              <Stat label="Monthly Debt Payments" value={formatCurrency(summary.totalMonthlyPayments)} />
              <Stat label="Progress" value={`${Math.round(summary.overallProgressPercent)}%`} />
              <Stat label="Already Eliminated" value={formatCurrency(summary.totalEliminated)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
