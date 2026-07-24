import type { Liability } from "@/types/financial";
import type { DebtPaymentPlanItem } from "@/types/debt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

/** Read-only breakdown of what's being paid toward each debt this month - the concrete plan, as opposed to the abstract "extra $/mo" slider that drives it. */
export function DebtPaymentPlan({ debts, plan }: { debts: Liability[]; plan: DebtPaymentPlanItem[] }) {
  if (plan.length === 0) return null;

  const debtsById = new Map(debts.map((d) => [d.id, d]));
  const totalThisMonth = plan.reduce((sum, item) => sum + item.totalPayment, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payment Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {plan.map((item, index) => {
          const debt = debtsById.get(item.debtId);
          if (!debt) return null;
          return (
            <div
              key={item.debtId}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{debt.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.minimumPayment)} minimum
                    {item.extraPayment > 0 && ` + ${formatCurrency(item.extraPayment)} extra`}
                  </p>
                </div>
              </div>
              <p className="shrink-0 font-semibold tabular-nums">{formatCurrency(item.totalPayment)}/mo</p>
            </div>
          );
        })}
        <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-sm font-medium">
          <span>Total this month</span>
          <span className="tabular-nums">{formatCurrency(totalThisMonth)}/mo</span>
        </div>
      </CardContent>
    </Card>
  );
}
