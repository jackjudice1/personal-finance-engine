import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getQuote, isFinnhubConfigured } from "@/lib/finnhub/client";

const REFRESH_TTL_MS = 5 * 60 * 1000;

/** Batch-refreshes the signed-in user's cached stock prices. One row per ticker already (see 0014 migration's unique constraint), so this is naturally deduped. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFinnhubConfigured()) {
    return NextResponse.json({ error: "Stock data isn't configured yet." }, { status: 503 });
  }

  const force = new URL(request.url).searchParams.get("force") === "true";

  const { data: holdings, error } = await supabase.from("stock_holdings").select("*").eq("user_id", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = Date.now();
  const staleHoldings = (holdings ?? []).filter((h) => {
    if (force || !h.last_price_fetched_at) return true;
    return now - new Date(h.last_price_fetched_at).getTime() > REFRESH_TTL_MS;
  });

  const results = await Promise.allSettled(
    staleHoldings.map(async (holding) => {
      const quote = await getQuote(holding.ticker);
      if (quote.currentPrice === 0) return null;
      await supabase
        .from("stock_holdings")
        .update({ last_price: quote.currentPrice, last_price_fetched_at: new Date().toISOString() })
        .eq("id", holding.id);
      return holding.ticker;
    })
  );

  const refreshed = results.filter((r) => r.status === "fulfilled" && r.value).length;

  return NextResponse.json({ refreshed, total: staleHoldings.length });
}
