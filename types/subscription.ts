import type { SubscriptionStatus, SubscriptionTier } from "@/types/database.types";

export interface SubscriptionState {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export const isPremiumTier = (state: Pick<SubscriptionState, "tier" | "status">): boolean =>
  state.tier === "premium" && (state.status === "active" || state.status === "trialing");
