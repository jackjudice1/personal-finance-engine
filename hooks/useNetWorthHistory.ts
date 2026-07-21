"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { FinancialProfile } from "@/types/financial";

export interface NetWorthPoint {
  date: string;
  netWorth: number;
}

/**
 * Upserts today's net worth snapshot (one row per user per day) and returns
 * recent history for the trend chart. Runs once profile totals are known.
 */
export function useNetWorthHistory(profile: FinancialProfile | null) {
  const { user } = useSupabaseUser();
  const [history, setHistory] = useState<NetWorthPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) return;
    let cancelled = false;

    async function sync() {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);

      await supabase.from("net_worth_snapshots").upsert(
        {
          user_id: user!.id,
          snapshot_date: today,
          total_assets: profile!.totalAssets,
          total_liabilities: profile!.totalLiabilities,
          net_worth: profile!.totalAssets - profile!.totalLiabilities,
        },
        { onConflict: "user_id,snapshot_date" }
      );

      const { data } = await supabase
        .from("net_worth_snapshots")
        .select("snapshot_date, net_worth")
        .eq("user_id", user!.id)
        .order("snapshot_date", { ascending: true })
        .limit(90);

      if (cancelled) return;
      setHistory((data ?? []).map((row) => ({ date: row.snapshot_date, netWorth: Number(row.net_worth) })));
      setIsLoading(false);
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user, profile]);

  return { history, isLoading };
}
