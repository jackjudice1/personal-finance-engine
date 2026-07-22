"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { Liability } from "@/types/financial";
import type { DebtFreedomSummary, PayoffStrategy } from "@/types/debt";
import type { DebtPaymentPoint } from "@/hooks/useDebtPaymentHistory";
import { projectDebtFreedom } from "@/lib/simulators/debtPayoff";
import { estimateInterestPaidToDate } from "@/lib/simulators/interestCalculations";

/**
 * The single source of truth for payoff projections: runs projectDebtFreedom
 * in a memo keyed on every input that affects it, and separately fetches
 * every debt's payment history once (bulk, not per-liability like
 * useDebtPaymentHistory) to fill in each debt's interestPaidToDate. Any
 * component showing payoff numbers should read from this hook rather than
 * calling projectDebtFreedom directly, so the hero card, debt list, and
 * (in later phases) the strategy comparison and simulator never drift out
 * of sync with each other.
 */
export function useDebtProjection(
  debts: Liability[],
  strategy: PayoffStrategy = "avalanche",
  extraMonthlyPayment = 0,
  customOrder?: string[]
): DebtFreedomSummary | null {
  const { user } = useSupabaseUser();
  const [paymentsByDebt, setPaymentsByDebt] = useState<Record<string, DebtPaymentPoint[]>>({});

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("debt_payments")
        .select("*")
        .eq("user_id", user!.id)
        .order("paid_at", { ascending: true });
      if (cancelled) return;

      const grouped: Record<string, DebtPaymentPoint[]> = {};
      for (const row of data ?? []) {
        const point: DebtPaymentPoint = {
          id: row.id,
          paidAt: row.paid_at,
          amount: Number(row.amount),
          balanceAfter: Number(row.balance_after),
        };
        (grouped[row.liability_id] ??= []).push(point);
      }
      setPaymentsByDebt(grouped);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return useMemo(() => {
    if (debts.length === 0) return null;

    const summary = projectDebtFreedom(debts, strategy, extraMonthlyPayment, customOrder);
    const debtsById = new Map(debts.map((d) => [d.id, d]));

    return {
      ...summary,
      perDebt: summary.perDebt.map((projection) => {
        const debt = debtsById.get(projection.debtId);
        const payments = paymentsByDebt[projection.debtId] ?? [];
        return {
          ...projection,
          interestPaidToDate: debt ? estimateInterestPaidToDate(payments, debt.interestRate) : 0,
        };
      }),
    };
  }, [debts, strategy, extraMonthlyPayment, customOrder, paymentsByDebt]);
}
