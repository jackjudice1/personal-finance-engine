"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { Liability } from "@/types/financial";
import type { DebtFormInput } from "@/lib/validations/debts";

function mapRow(row: {
  id: string;
  type: Liability["type"];
  label: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number | null;
}): Liability {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    balance: Number(row.balance),
    interestRate: Number(row.interest_rate),
    minimumPayment: Number(row.minimum_payment ?? 0),
  };
}

export function useDebts() {
  const { user } = useSupabaseUser();
  const [debts, setDebts] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setRefetchToken((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", user!.id)
        .order("balance", { ascending: false });
      if (cancelled) return;
      setDebts((data ?? []).map(mapRow));
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, refetchToken]);

  async function createDebt(input: DebtFormInput) {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("liabilities").insert({
      user_id: user.id,
      type: input.type,
      label: input.label,
      balance: input.balance,
      interest_rate: input.interestRate,
      minimum_payment: input.minimumPayment,
    });
    refetch();
  }

  async function updateDebt(debtId: string, input: DebtFormInput) {
    const supabase = createClient();
    await supabase
      .from("liabilities")
      .update({
        type: input.type,
        label: input.label,
        balance: input.balance,
        interest_rate: input.interestRate,
        minimum_payment: input.minimumPayment,
      })
      .eq("id", debtId);
    refetch();
  }

  async function deleteDebt(debtId: string) {
    const supabase = createClient();
    await supabase.from("liabilities").delete().eq("id", debtId);
    refetch();
  }

  return { debts, isLoading, refetch, createDebt, updateDebt, deleteDebt };
}
