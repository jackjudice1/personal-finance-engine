"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { DebtPaymentPoint } from "@/hooks/useDebtPaymentHistory";

/** Every payment across every one of the user's debts, grouped by liability id - fetched once, in bulk (not per-liability like useDebtPaymentHistory). */
export function useAllDebtPayments(): Record<string, DebtPaymentPoint[]> {
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

  return paymentsByDebt;
}
