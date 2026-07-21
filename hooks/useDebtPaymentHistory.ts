"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LogPaymentInput } from "@/lib/validations/debtPayment";

export interface DebtPaymentPoint {
  id: string;
  paidAt: string;
  amount: number;
  balanceAfter: number;
}

/**
 * Payment history for a single debt, plus the ability to log a new payment.
 * Logging calls the log_debt_payment() RPC (see database/migrations/0015),
 * which atomically decreases the liability's balance and records the
 * resulting balance on the payment row - so refetching this hook's history
 * is not enough on its own; callers must also refetch the debts list (see
 * onPaymentLogged).
 */
export function useDebtPaymentHistory(liabilityId: string | null, onPaymentLogged?: () => void) {
  const [history, setHistory] = useState<DebtPaymentPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setRefetchToken((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!liabilityId) {
      setHistory([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("debt_payments")
        .select("*")
        .eq("liability_id", liabilityId!)
        .order("paid_at", { ascending: true });
      if (cancelled) return;
      setHistory(
        (data ?? []).map((row) => ({
          id: row.id,
          paidAt: row.paid_at,
          amount: Number(row.amount),
          balanceAfter: Number(row.balance_after),
        }))
      );
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [liabilityId, refetchToken]);

  async function logPayment(input: LogPaymentInput) {
    if (!liabilityId) return;
    const supabase = createClient();
    const { error } = await supabase.rpc("log_debt_payment", {
      p_liability_id: liabilityId,
      p_amount: input.amount,
      p_paid_at: input.paidAt.slice(0, 10),
    });
    if (error) throw new Error(error.message);
    refetch();
    onPaymentLogged?.();
  }

  return { history, isLoading, refetch, logPayment };
}
