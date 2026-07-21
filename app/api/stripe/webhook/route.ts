import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/stripe/client";

/**
 * Stripe webhook receiver stub. Returns 501 until Stripe is actually wired
 * up (no signature verification happens here yet - do not remove that
 * check when implementing, or anyone could POST fake subscription events).
 *
 * To implement:
 *   1. `npm install stripe`
 *   2. Read the raw body + `stripe-signature` header, verify with
 *      `stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)`
 *   3. Switch on `event.type` and call the matching handler in
 *      lib/stripe/webhookHandlers.ts
 */
export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 501 });
  }

  return NextResponse.json({ error: "Stripe webhook handling is not implemented yet." }, { status: 501 });
}
