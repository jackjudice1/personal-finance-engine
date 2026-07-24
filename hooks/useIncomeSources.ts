"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { IncomeSource } from "@/types/financial";
import type { IncomeFrequency, IncomeType } from "@/types/database.types";

export function useIncomeSources() {
  const { user } = useSupabaseUser();
  const [items, setItems] = useState<IncomeSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("income_sources").select("*").eq("user_id", user!.id);
      if (cancelled) return;
      setItems(
        (data ?? []).map((r) => ({
          id: r.id,
          label: r.label,
          amount: Number(r.amount),
          frequency: r.frequency,
          isPrimary: r.is_primary,
          type: r.type,
          deductionRate: r.deduction_rate == null ? null : Number(r.deduction_rate),
        }))
      );
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, tick]);

  async function add(
    label: string,
    amount: number,
    frequency: IncomeFrequency,
    type: IncomeType,
    deductionRate: number | null = null
  ) {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("income_sources")
      .insert({ user_id: user.id, label, amount, frequency, type, is_primary: false, deduction_rate: deductionRate });
    refetch();
  }

  async function update(
    id: string,
    updates: Partial<{ label: string; amount: number; frequency: IncomeFrequency; type: IncomeType; deductionRate: number | null }>
  ) {
    const supabase = createClient();
    await supabase
      .from("income_sources")
      .update({
        ...(updates.label !== undefined && { label: updates.label }),
        ...(updates.amount !== undefined && { amount: updates.amount }),
        ...(updates.frequency !== undefined && { frequency: updates.frequency }),
        ...(updates.type !== undefined && { type: updates.type }),
        ...(updates.deductionRate !== undefined && { deduction_rate: updates.deductionRate }),
      })
      .eq("id", id);
    refetch();
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("income_sources").delete().eq("id", id);
    refetch();
  }

  return { items, isLoading, add, update, remove };
}
