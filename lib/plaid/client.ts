/**
 * Stub Plaid client. No `plaid` package is installed and no network calls
 * happen here - this exists purely as the seam for wiring real bank
 * connections later. Once PLAID_CLIENT_ID/PLAID_SECRET are set and
 * `npm install plaid` has been run, implement these against the real SDK
 * and start writing rows into `transactions` with `source = 'plaid'`.
 */
export function isPlaidConfigured(): boolean {
  return Boolean(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
}

export async function createLinkToken(_userId: string): Promise<string> {
  throw new Error("Plaid is not wired up yet. See lib/plaid/client.ts.");
}

export async function exchangePublicToken(_publicToken: string): Promise<{ accessToken: string; itemId: string }> {
  throw new Error("Plaid is not wired up yet. See lib/plaid/client.ts.");
}

export async function fetchTransactions(_accessToken: string): Promise<unknown[]> {
  throw new Error("Plaid is not wired up yet. See lib/plaid/client.ts.");
}
