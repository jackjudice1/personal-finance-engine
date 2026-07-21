"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { deriveLevel } from "@/lib/engine/levels";
import { LEVEL_RANK } from "@/lib/constants/levels";
import type { UserLevel } from "@/types/database.types";
import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown } from "@/types/engine";

export function useUserLevel(profile: FinancialProfile | null, health: HealthScoreBreakdown | null) {
  const { user } = useSupabaseUser();
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    if (!user || !profile || !health) return;
    let cancelled = false;

    async function run() {
      const supabase = createClient();
      const newLevel = deriveLevel(profile!, health!);
      const { data } = await supabase
        .from("user_levels")
        .select("current_level")
        .eq("user_id", user!.id)
        .maybeSingle();
      const previousLevel = data?.current_level ?? "beginner";

      if (previousLevel !== newLevel) {
        await supabase.from("user_levels").upsert({ user_id: user!.id, current_level: newLevel });
      }

      if (cancelled) return;
      setLevel(newLevel);
      setLeveledUp(data !== null && LEVEL_RANK[newLevel] > LEVEL_RANK[previousLevel]);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [user, profile, health]);

  return { level, leveledUp };
}
