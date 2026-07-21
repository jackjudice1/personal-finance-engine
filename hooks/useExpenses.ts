"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { Expense } from "@/types/financial";
import type { ExpenseCategory } from "@/types/database.types";

export function useExpenses() {
  const { user } = useSupabaseUser();
  const [items, setItems] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("expenses").select("*").eq("user_id", user!.id);
      if (cancelled) return;
      setItems((data ?? []).map((r) => ({ id: r.id, category: r.category, label: r.label, amount: Number(r.amount) })));
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, tick]);

  async function add(category: ExpenseCategory, amount: number, label?: string) {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("expenses").insert({ user_id: user.id, category, amount, label: label ?? null });
    refetch();
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("expenses").delete().eq("id", id);
    refetch();
  }

  return { items, isLoading, add, remove };
}
