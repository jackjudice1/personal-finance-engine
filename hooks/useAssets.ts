"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { Asset } from "@/types/financial";
import type { AssetType } from "@/types/database.types";

export function useAssets() {
  const { user } = useSupabaseUser();
  const [items, setItems] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("assets").select("*").eq("user_id", user!.id);
      if (cancelled) return;
      setItems(
        (data ?? []).map((r) => ({
          id: r.id,
          type: r.type,
          label: r.label,
          balance: Number(r.balance),
          interestRate: r.interest_rate === null ? null : Number(r.interest_rate),
          isEmergencyFund: r.is_emergency_fund,
        }))
      );
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, tick]);

  async function add(type: AssetType, label: string, balance: number, isEmergencyFund: boolean) {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("assets").insert({ user_id: user.id, type, label, balance, is_emergency_fund: isEmergencyFund });
    refetch();
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("assets").delete().eq("id", id);
    refetch();
  }

  return { items, isLoading, add, remove };
}
