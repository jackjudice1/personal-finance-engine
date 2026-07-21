"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { Liability } from "@/types/financial";
import type { LiabilityType } from "@/types/database.types";

export function useLiabilities() {
  const { user } = useSupabaseUser();
  const [items, setItems] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("liabilities").select("*").eq("user_id", user!.id);
      if (cancelled) return;
      setItems(
        (data ?? []).map((r) => ({
          id: r.id,
          type: r.type,
          label: r.label,
          balance: Number(r.balance),
          interestRate: Number(r.interest_rate),
          minimumPayment: Number(r.minimum_payment ?? 0),
        }))
      );
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, tick]);

  async function add(type: LiabilityType, label: string, balance: number, interestRate: number, minimumPayment: number) {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("liabilities")
      .insert({ user_id: user.id, type, label, balance, interest_rate: interestRate, minimum_payment: minimumPayment });
    refetch();
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("liabilities").delete().eq("id", id);
    refetch();
  }

  return { items, isLoading, add, remove };
}
