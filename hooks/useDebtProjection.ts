"use client";

import { useMemo } from "react";
import type { Liability } from "@/types/financial";
import type { DebtFreedomSummary, PayoffStrategy } from "@/types/debt";
import { useAllDebtPayments } from "@/hooks/useAllDebtPayments";
import { projectDebtFreedom } from "@/lib/simulators/debtPayoff";
import { estimateInterestPaidToDate } from "@/lib/simulators/interestCalculations";

/**
 * The single source of truth for payoff projections: runs projectDebtFreedom
 * in a memo keyed on every input that affects it, and pulls in every debt's
 * payment history (via useAllDebtPayments) to fill in each debt's
 * interestPaidToDate. Any component showing payoff numbers should read from
 * this hook rather than calling projectDebtFreedom directly, so the hero
 * card, debt list, strategy comparison, and simulator never drift out of
 * sync with each other.
 */
export function useDebtProjection(
  debts: Liability[],
  strategy: PayoffStrategy = "avalanche",
  extraMonthlyPayment = 0,
  customOrder?: string[],
  /** The real, untransformed debts - used only to price interestPaidToDate at the actual rate. Defaults to `debts` when there's no what-if transform in play; pass the real array separately when `debts` might be a hypothetical (e.g. a refinance what-if), since a future rate change can't retroactively change interest already paid. */
  realDebts: Liability[] = debts
): DebtFreedomSummary | null {
  const paymentsByDebt = useAllDebtPayments();

  return useMemo(() => {
    if (debts.length === 0) return null;

    const summary = projectDebtFreedom(debts, strategy, extraMonthlyPayment, customOrder);
    const realDebtsById = new Map(realDebts.map((d) => [d.id, d]));

    return {
      ...summary,
      perDebt: summary.perDebt.map((projection) => {
        const realDebt = realDebtsById.get(projection.debtId);
        const payments = paymentsByDebt[projection.debtId] ?? [];
        return {
          ...projection,
          interestPaidToDate: realDebt ? estimateInterestPaidToDate(payments, realDebt.interestRate) : 0,
        };
      }),
    };
  }, [debts, strategy, extraMonthlyPayment, customOrder, realDebts, paymentsByDebt]);
}
