"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Plus } from "lucide-react";
import { useDebts } from "@/hooks/useDebts";
import { useDebtProjection } from "@/hooks/useDebtProjection";
import { applyWhatIfPreset, type WhatIfPreset } from "@/lib/simulators/debtWhatIf";
import type { PayoffStrategy } from "@/types/debt";
import { DebtCard } from "@/components/debts/DebtCard";
import { DebtFreedomCountdown } from "@/components/debts/DebtFreedomCountdown";
import { ExtraPaymentSimulator } from "@/components/debts/ExtraPaymentSimulator";
import { DebtWhatIfPresets } from "@/components/debts/DebtWhatIfPresets";
import { DebtStrategyComparison } from "@/components/debts/DebtStrategyComparison";
import { DebtTimeline } from "@/components/debts/DebtTimeline";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DebtsPage() {
  const { debts, isLoading } = useDebts();
  const [strategy, setStrategy] = useState<PayoffStrategy>("avalanche");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(0);
  const [activeWhatIf, setActiveWhatIf] = useState<WhatIfPreset | null>(null);
  const [customOrder, setCustomOrder] = useState<string[]>([]);

  const effectiveCustomOrder = customOrder.length === debts.length ? customOrder : debts.map((d) => d.id);
  const { debts: effectiveDebts, extraMonthlyPayment: effectiveExtraPayment } = applyWhatIfPreset(
    debts,
    extraMonthlyPayment,
    activeWhatIf
  );

  const summary = useDebtProjection(effectiveDebts, strategy, effectiveExtraPayment, effectiveCustomOrder, debts);
  const projectionByDebtId = new Map(summary?.perDebt.map((p) => [p.debtId, p]) ?? []);
  const activeDebts = debts.filter((d) => d.balance > 0);
  const paidOffDebts = debts.filter((d) => d.balance === 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Debts</h1>
          <p className="text-sm text-muted-foreground">Track balances, edit details, and log payments as you pay down.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/dashboard/debts/new" />}>
          <Plus className="size-4" />
          Add debt
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : debts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 p-12 text-center">
          <CreditCard className="size-8 text-muted-foreground" />
          <p className="font-medium">No debts yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add a credit card, loan, or mortgage and track your payoff progress as you pay it down.
          </p>
          <Button className="mt-2" nativeButton={false} render={<Link href="/dashboard/debts/new" />}>
            <Plus className="size-4" />
            Add your first debt
          </Button>
        </div>
      ) : (
        <>
          {summary && <DebtFreedomCountdown summary={summary} />}

          {activeDebts.length > 1 && summary && (
            <div className="grid gap-4 lg:grid-cols-2">
              <ExtraPaymentSimulator value={extraMonthlyPayment} onChange={setExtraMonthlyPayment} />
              <DebtWhatIfPresets active={activeWhatIf} onSelect={setActiveWhatIf} />
            </div>
          )}
          {activeDebts.length === 1 && (
            <ExtraPaymentSimulator value={extraMonthlyPayment} onChange={setExtraMonthlyPayment} />
          )}

          {activeDebts.length > 1 && (
            <DebtStrategyComparison
              debts={effectiveDebts}
              extraMonthlyPayment={effectiveExtraPayment}
              strategy={strategy}
              onStrategyChange={setStrategy}
              customOrder={effectiveCustomOrder}
              onCustomOrderChange={setCustomOrder}
            />
          )}

          {summary && <DebtTimeline summary={summary} debts={debts} />}

          {activeDebts.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeDebts.map((debt) => {
                const projection = projectionByDebtId.get(debt.id);
                return projection ? <DebtCard key={debt.id} debt={debt} projection={projection} /> : null;
              })}
            </div>
          )}

          {paidOffDebts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Paid off</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paidOffDebts.map((debt) => {
                  const projection = projectionByDebtId.get(debt.id);
                  return projection ? <DebtCard key={debt.id} debt={debt} projection={projection} /> : null;
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
