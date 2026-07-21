import Link from "next/link";
import { Car, CreditCard, GraduationCap, Home, PartyPopper, Wallet } from "lucide-react";
import type { Liability } from "@/types/financial";
import { LIABILITY_TYPE_LABELS } from "@/types/financial";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/utils/formatters";

const LIABILITY_TYPE_ICONS: Record<Liability["type"], typeof CreditCard> = {
  credit_card: CreditCard,
  student_loan: GraduationCap,
  auto_loan: Car,
  mortgage: Home,
  personal_loan: Wallet,
  other: Wallet,
};

export function DebtCard({ debt }: { debt: Liability }) {
  const Icon = debt.balance === 0 ? PartyPopper : LIABILITY_TYPE_ICONS[debt.type];
  const isPaidOff = debt.balance === 0;

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
              <Badge variant="outline">{formatPercent(debt.interestRate / 100, 2)} APR</Badge>
            )}
          </div>

          <p className="text-2xl font-semibold tabular-nums">{formatCurrency(debt.balance)}</p>

          {!isPaidOff && (
            <p className="text-xs text-muted-foreground">
              {debt.minimumPayment > 0 ? `${formatCurrency(debt.minimumPayment)}/mo minimum` : "No minimum payment set"}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
