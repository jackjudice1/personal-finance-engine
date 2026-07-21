"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, Trash2 } from "lucide-react";
import type { Liability } from "@/types/financial";
import type { DebtFormInput } from "@/lib/validations/debts";
import type { LogPaymentInput } from "@/lib/validations/debtPayment";
import type { DebtPaymentPoint } from "@/hooks/useDebtPaymentHistory";
import { DebtForm } from "@/components/debts/DebtForm";
import { LogPaymentForm } from "@/components/debts/LogPaymentForm";
import { DebtPayoffChart } from "@/components/debts/DebtPayoffChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function DebtDetailPanel({
  debt,
  history,
  onUpdate,
  onLogPayment,
  onDelete,
}: {
  debt: Liability;
  history: DebtPaymentPoint[];
  onUpdate: (values: DebtFormInput) => Promise<void>;
  onLogPayment: (values: LogPaymentInput) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const isPaidOff = debt.balance === 0;

  async function handleDelete() {
    if (history.length > 0) {
      const confirmed = window.confirm(
        `This debt has ${history.length} logged payment${history.length === 1 ? "" : "s"} — deleting it will also delete that payment history. Continue?`
      );
      if (!confirmed) return;
    }
    setIsDeleting(true);
    await onDelete();
    router.push("/dashboard/debts");
  }

  return (
    <div className="max-w-2xl space-y-6">
      {isPaidOff ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <PartyPopper className="size-6" />
            </div>
            <p className="text-lg font-semibold">Paid off!</p>
            <p className="text-sm text-muted-foreground">{debt.label} is fully paid off. Nice work.</p>
          </CardContent>
        </Card>
      ) : (
        <DebtPayoffChart history={history} currentBalance={debt.balance} />
      )}

      {!isPaidOff && (
        <Card>
          <CardHeader>
            <CardTitle>Log a payment</CardTitle>
          </CardHeader>
          <CardContent>
            <LogPaymentForm currentBalance={debt.balance} onSubmit={onLogPayment} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit debt</CardTitle>
        </CardHeader>
        <CardContent>
          <DebtForm
            defaultValues={{
              type: debt.type,
              label: debt.label,
              balance: debt.balance,
              interestRate: debt.interestRate,
              minimumPayment: debt.minimumPayment,
            }}
            onSubmit={onUpdate}
          />
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...history].reverse().map((point) => (
              <div
                key={point.id}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
              >
                <span>{formatDate(point.paidAt)}</span>
                <span className="text-primary">-{formatCurrency(point.amount)}</span>
                <span className="text-xs text-muted-foreground">{formatCurrency(point.balanceAfter)} remaining</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="size-4" />
          Delete debt
        </Button>
      </div>
    </div>
  );
}
