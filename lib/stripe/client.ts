/**
 * Stub Stripe client. No `stripe` package is installed and no network calls
 * happen here yet - this exists purely as the seam for wiring real billing
 * later. Once STRIPE_SECRET_KEY is set and `npm install stripe` has been
 * run, replace `getStripeClient()`'s body with a real
 * `new Stripe(secretKey)` and update callers accordingly.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeClient(): never {
  throw new Error(
    "Stripe is not wired up yet. Set STRIPE_SECRET_KEY, install the `stripe` package, and implement getStripeClient() in lib/stripe/client.ts."
  );
}
