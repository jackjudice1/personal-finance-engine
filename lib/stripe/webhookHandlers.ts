import type { SubscriptionStatus, SubscriptionTier } from "@/types/database.types";

/**
 * Typed stubs for the Stripe webhook events that matter for subscriptions.
 * None of these are wired to a real Stripe SDK yet (no `stripe` package,
 * no signature verification) - see app/api/stripe/webhook/route.ts, which
 * is the only caller. Fill these in once Stripe keys exist:
 *
 *   1. `npm install stripe`
 *   2. Verify the webhook signature in the route handler using
 *      `STRIPE_WEBHOOK_SECRET`
 *   3. Implement each handler body below using the admin Supabase client
 *      (lib/supabase/admin.ts) to bypass RLS and write `subscriptions` rows
 */

export interface StripeSubscriptionEventPayload {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export async function handleCheckoutSessionCompleted(_payload: StripeSubscriptionEventPayload): Promise<void> {
  // TODO: upsert `subscriptions` row with tier='premium', status='active'
}

export async function handleSubscriptionUpdated(_payload: StripeSubscriptionEventPayload): Promise<void> {
  // TODO: sync status/current_period_end/cancel_at_period_end onto `subscriptions`
}

export async function handleSubscriptionDeleted(_payload: Pick<StripeSubscriptionEventPayload, "userId">): Promise<void> {
  // TODO: set tier='free', status='canceled' on `subscriptions`
}

export async function handleInvoicePaymentFailed(_payload: Pick<StripeSubscriptionEventPayload, "userId">): Promise<void> {
  // TODO: set status='past_due' on `subscriptions`
}
