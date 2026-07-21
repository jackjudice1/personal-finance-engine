"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { IncomeSource } from "@/types/financial";
import type { IncomeFrequency } from "@/types/database.types";

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
        }))
      );
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, tick]);

  async function add(label: string, amount: number, frequency: IncomeFrequency) {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("income_sources").insert({ user_id: user.id, label, amount, frequency, is_primary: false });
    refetch();
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("income_sources").delete().eq("id", id);
    refetch();
  }

  return { items, isLoading, add, remove };
}
