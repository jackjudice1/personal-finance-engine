"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/constants/achievements";
import type { AchievementDefinition } from "@/types/gamification";
import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown } from "@/types/engine";

export function useAchievements(profile: FinancialProfile | null, health: HealthScoreBreakdown | null) {
  const { user } = useSupabaseUser();
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile || !health) return;
    let cancelled = false;

    async function run() {
      const supabase = createClient();
      const { data } = await supabase.from("achievements").select("achievement_key").eq("user_id", user!.id);
      const existingKeys = new Set((data ?? []).map((row) => row.achievement_key));

      const toUnlock = ACHIEVEMENT_DEFINITIONS.filter(
        (def) => !existingKeys.has(def.key) && def.predicate(profile!, health!)
      );

      if (toUnlock.length > 0) {
        await supabase
          .from("achievements")
          .insert(toUnlock.map((def) => ({ user_id: user!.id, achievement_key: def.key })));
        toUnlock.forEach((def) => existingKeys.add(def.key));
      }

      if (cancelled) return;
      setUnlockedKeys(existingKeys);
      setNewlyUnlocked(toUnlock);
      setIsLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [user, profile, health]);

  return { unlockedKeys, newlyUnlocked, isLoading };
}
