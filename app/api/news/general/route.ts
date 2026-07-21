import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildFinancialProfile } from "@/lib/engine/buildProfile";
import { calculateHealthScore } from "@/lib/engine/healthScore";
import { FinnhubError, getGeneralNews, isFinnhubConfigured, type FinnhubNewsArticle } from "@/lib/finnhub/client";

const DEBT_KEYWORDS = ["debt", "credit card", "loan", "student loan", "mortgage", "interest rate", "refinance", "borrow"];
const INVESTING_KEYWORDS = ["stock", "invest", "market", "shares", "fund", "portfolio", "dividend", "etf", "ipo", "earnings"];

const ARTICLE_LIMIT = 12;

function keywordScore(article: FinnhubNewsArticle, keywords: string[]): number {
  const text = `${article.headline} ${article.summary}`.toLowerCase();
  return keywords.reduce((score, kw) => (text.includes(kw) ? score + 1 : score), 0);
}

/**
 * Personalized general market feed. Finnhub's free tier has no keyword/topic
 * search endpoint, so this is a single general-category feed re-ranked by
 * keyword match - not a true "debt news" or "investing news" search. The
 * response's personalizationMethod field lets the UI label this honestly.
 */
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

  const [incomeRes, expensesRes, assetsRes, liabilitiesRes, goalsRes, stockHoldingsRes] = await Promise.all([
    supabase.from("income_sources").select("*").eq("user_id", user.id),
    supabase.from("expenses").select("*").eq("user_id", user.id),
    supabase.from("assets").select("*").eq("user_id", user.id),
    supabase.from("liabilities").select("*").eq("user_id", user.id),
    supabase.from("goals").select("*").eq("user_id", user.id).eq("status", "active"),
    supabase.from("stock_holdings").select("*").eq("user_id", user.id),
  ]);

  const profile = buildFinancialProfile({
    userId: user.id,
    incomeSources: incomeRes.data ?? [],
    expenses: expensesRes.data ?? [],
    assets: assetsRes.data ?? [],
    liabilities: liabilitiesRes.data ?? [],
    goals: goalsRes.data ?? [],
    stockHoldings: stockHoldingsRes.data ?? [],
  });

  const health = calculateHealthScore(profile);
  const lean: "debt" | "investing" = health.debt < 60 ? "debt" : "investing";
  const keywords = lean === "debt" ? DEBT_KEYWORDS : INVESTING_KEYWORDS;

  try {
    const articles = await getGeneralNews("general");
    const ranked = [...articles]
      .map((article) => ({ article, score: keywordScore(article, keywords) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, ARTICLE_LIMIT)
      .map((r) => r.article);

    return NextResponse.json({
      lean,
      personalizationMethod: "keyword-filtered" as const,
      articles: ranked,
    });
  } catch (error) {
    const status = error instanceof FinnhubError ? error.status : 500;
    return NextResponse.json({ error: "Couldn't load news right now." }, { status });
  }
}
