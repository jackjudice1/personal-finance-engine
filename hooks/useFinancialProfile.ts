"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildFinancialProfile } from "@/lib/engine/buildProfile";
import type { FinancialProfile } from "@/types/financial";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

interface UseFinancialProfileResult {
  profile: FinancialProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches every table that makes up a user's financial picture and reduces
 * it into the normalized FinancialProfile shape lib/engine consumes. Runs
 * client-side against Supabase directly - RLS scopes every query to the
 * signed-in user, so there's no server round trip needed for this read.
 */
export function useFinancialProfile(): UseFinancialProfileResult {
  const { user } = useSupabaseUser();
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setRefetchToken((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [incomeRes, expensesRes, assetsRes, liabilitiesRes, goalsRes] = await Promise.all([
        supabase.from("income_sources").select("*").eq("user_id", user!.id),
        supabase.from("expenses").select("*").eq("user_id", user!.id),
        supabase.from("assets").select("*").eq("user_id", user!.id),
        supabase.from("liabilities").select("*").eq("user_id", user!.id),
        supabase.from("goals").select("*").eq("user_id", user!.id).eq("status", "active"),
      ]);

      if (cancelled) return;

      const firstError =
        incomeRes.error ?? expensesRes.error ?? assetsRes.error ?? liabilitiesRes.error ?? goalsRes.error;
      if (firstError) {
        setError(firstError.message);
        setIsLoading(false);
        return;
      }

      setProfile(
        buildFinancialProfile({
          userId: user!.id,
          incomeSources: incomeRes.data ?? [],
          expenses: expensesRes.data ?? [],
          assets: assetsRes.data ?? [],
          liabilities: liabilitiesRes.data ?? [],
          goals: goalsRes.data ?? [],
        })
      );
      setError(null);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, refetchToken]);

  return { profile, isLoading, error, refetch };
}
