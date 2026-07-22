import Link from "next/link";
import { Car, CreditCard, GraduationCap, Home, PartyPopper, Wallet } from "lucide-react";
import type { Liability } from "@/types/financial";
import { LIABILITY_TYPE_LABELS } from "@/types/financial";
import type { DebtProjection } from "@/types/debt";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getUrgencyColor } from "@/lib/utils";
import { formatCurrency, formatDate, formatPercent } from "@/utils/formatters";

const LIABILITY_TYPE_ICONS: Record<Liability["type"], typeof CreditCard> = {
  credit_card: CreditCard,
  student_loan: GraduationCap,
  auto_loan: Car,
  mortgage: Home,
  personal_loan: Wallet,
  other: Wallet,
};

/** APR urgency uses its own thresholds (higher APR = more urgent = red) - the inverse direction of getUrgencyColor's "higher is better" scoring. */
function getAprUrgencyClasses(apr: number): string {
  if (apr <= 10) return "border-transparent bg-success/15 text-success";
  if (apr <= 20) return "border-transparent bg-warning/15 text-warning";
  return "border-transparent bg-destructive/15 text-destructive";
}

export function DebtCard({ debt, projection }: { debt: Liability; projection: DebtProjection }) {
  const Icon = debt.balance === 0 ? PartyPopper : LIABILITY_TYPE_ICONS[debt.type];
  const isPaidOff = debt.balance === 0;
  const progressPercent =
    debt.originalBalance > 0 ? Math.min(100, Math.max(0, ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100)) : 100;

  return (
    <Link href={`/dashboard/debts/${debt.id}`}>
      <Card className="h-full transition-colors hover:border-primary/40">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-4.5" />
              </div>
              <div>
                <p className="font-medium">{debt.label}</p>
                <p className="text-xs text-muted-foreground">{LIABILITY_TYPE_LABELS[debt.type]}</p>
              </div>
            </div>
            {isPaidOff ? (
              <Badge className="bg-primary text-primary-foreground">Paid off</Badge>
            ) : (
              <Badge variant="outline" className={getAprUrgencyClasses(debt.interestRate)}>
                {formatPercent(debt.interestRate / 100, 2)} APR
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(debt.balance)}</p>
            <p className="text-xs text-muted-foreground">of {formatCurrency(debt.originalBalance)} original</p>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", getUrgencyColor(progressPercent))}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {!isPaidOff && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{debt.minimumPayment > 0 ? `${formatCurrency(debt.minimumPayment)}/mo minimum` : "No minimum set"}</span>
              <span className="text-right">
                {projection.monthsRemaining !== null ? `${projection.monthsRemaining} mo remaining` : "Won't pay off"}
              </span>
              <span>{formatCurrency(projection.interestPaidToDate)} interest paid</span>
              <span className="text-right">{formatCurrency(projection.interestRemaining)} interest left</span>
              {projection.payoffDate && (
                <span className="col-span-2">Est. payoff: {formatDate(projection.payoffDate)}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
