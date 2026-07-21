import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FinnhubError, getCompanyNews, isFinnhubConfigured, type FinnhubNewsArticle } from "@/lib/finnhub/client";

export interface TickerNewsArticle extends FinnhubNewsArticle {
  ticker: string;
}

/** Company-specific news for every ticker the user actually holds, merged and sorted by recency. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFinnhubConfigured()) {
    return NextResponse.json({ error: "News isn't configured yet." }, { status: 503 });
  }

  const { data: holdings, error } = await supabase
    .from("stock_holdings")
    .select("ticker")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!holdings || holdings.length === 0) {
    return NextResponse.json({ articles: [] });
  }

  try {
    const perTicker = await Promise.all(
      holdings.map(async (h): Promise<TickerNewsArticle[]> => {
        const articles = await getCompanyNews(h.ticker);
        return articles.map((article) => ({ ...article, ticker: h.ticker }));
      })
    );

    const merged = perTicker.flat().sort((a, b) => b.datetime - a.datetime);
    return NextResponse.json({ articles: merged });
  } catch (error) {
    const status = error instanceof FinnhubError ? error.status : 500;
    return NextResponse.json({ error: "Couldn't load holdings news right now." }, { status });
  }
}
