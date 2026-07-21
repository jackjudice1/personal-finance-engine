import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { isPremiumTier, type SubscriptionState } from "@/types/subscription";

/**
 * Reads subscription state from the `subscriptions` table only - no Stripe
 * network calls. Every user gets a free-tier row on signup (see
 * database/migrations/0009_subscriptions.sql), so this never has to handle
 * a missing row as a special case.
 */
export async function getSubscriptionState(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<SubscriptionState> {
  const { data } = await supabase
    .from("subscriptions")
    .select("tier, status, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  return {
    tier: data?.tier ?? "free",
    status: data?.status ?? "none",
    currentPeriodEnd: data?.current_period_end ?? null,
    cancelAtPeriodEnd: data?.cancel_at_period_end ?? false,
  };
}

export async function isPremium(supabase: SupabaseClient<Database>, userId: string): Promise<boolean> {
  const state = await getSubscriptionState(supabase, userId);
  return isPremiumTier(state);
}
