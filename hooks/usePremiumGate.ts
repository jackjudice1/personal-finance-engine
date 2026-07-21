"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { isPremiumTier } from "@/types/subscription";

export function usePremiumGate() {
  const { user } = useSupabaseUser();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("subscriptions")
        .select("tier, status")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (cancelled) return;
      setIsPremium(data ? isPremiumTier(data) : false);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isPremium, isLoading };
}
