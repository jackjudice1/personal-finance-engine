import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FinnhubError, getCompanyProfile, getQuote, isFinnhubConfigured } from "@/lib/finnhub/client";

/** Validates a ticker + returns live price/company name for the add-position form. No DB write. */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const symbol = new URL(request.url).searchParams.get("symbol")?.trim();
  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  if (!isFinnhubConfigured()) {
    return NextResponse.json({ error: "Stock data isn't configured yet." }, { status: 503 });
  }

  try {
    const [quote, profile] = await Promise.all([getQuote(symbol), getCompanyProfile(symbol)]);

    if (quote.currentPrice === 0) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }

    return NextResponse.json({
      ticker: symbol.toUpperCase(),
      companyName: profile?.name ?? null,
      currentPrice: quote.currentPrice,
      change: quote.change,
      percentChange: quote.percentChange,
    });
  } catch (error) {
    const status = error instanceof FinnhubError ? error.status : 500;
    return NextResponse.json({ error: "Couldn't look up that ticker right now." }, { status });
  }
}
