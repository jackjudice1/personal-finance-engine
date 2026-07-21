"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { HealthScoreBreakdown, HealthScoreHistoryPoint } from "@/types/engine";

/**
 * Upserts today's health score snapshot (one row per user per day) and
 * returns recent history for the trend chart. Mirrors useNetWorthHistory.
 */
export function useHealthScoreHistory(health: HealthScoreBreakdown | null) {
  const { user } = useSupabaseUser();
  const [history, setHistory] = useState<HealthScoreHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !health) return;
    let cancelled = false;

    async function sync() {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);

      await supabase.from("health_score_snapshots").upsert(
        {
          user_id: user!.id,
          snapshot_date: today,
          overall_score: health!.overall,
          cash_flow_score: health!.cashFlow,
          debt_score: health!.debt,
          savings_score: health!.savings,
          investment_score: health!.investment,
        },
        { onConflict: "user_id,snapshot_date" }
      );

      const { data } = await supabase
        .from("health_score_snapshots")
        .select("snapshot_date, overall_score")
        .eq("user_id", user!.id)
        .order("snapshot_date", { ascending: true })
        .limit(90);

      if (cancelled) return;
      setHistory((data ?? []).map((row) => ({ date: row.snapshot_date, overall: row.overall_score })));
      setIsLoading(false);
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user, health]);

  return { history, isLoading };
}
