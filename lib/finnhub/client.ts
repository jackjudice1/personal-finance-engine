/**
 * Real Finnhub client (not a stub, unlike lib/stripe/* and lib/plaid/*).
 * Server-only - FINNHUB_API_KEY must never be exposed to the client, so
 * every call here is made from a Route Handler, never from "use client"
 * code directly.
 */

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export function isFinnhubConfigured(): boolean {
  return Boolean(process.env.FINNHUB_API_KEY);
}

export class FinnhubError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FinnhubError";
    this.status = status;
  }
}

async function finnhubFetch<T>(
  path: string,
  params: Record<string, string>,
  revalidateSeconds: number
): Promise<T> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    throw new FinnhubError("Finnhub is not configured. Set FINNHUB_API_KEY in .env.local.", 503);
  }

  const query = new URLSearchParams({ ...params, token: apiKey });
  const res = await fetch(`${FINNHUB_BASE_URL}${path}?${query.toString()}`, {
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new FinnhubError(`Finnhub request failed (${res.status})`, res.status);
  }

  return (await res.json()) as T;
}

export interface FinnhubQuote {
  currentPrice: number;
  change: number;
  percentChange: number;
  previousClose: number;
}

/** Finnhub returns c: 0 (not a 404) for an unrecognized symbol - callers should treat currentPrice === 0 as "not found." */
export async function getQuote(symbol: string): Promise<FinnhubQuote> {
  const data = await finnhubFetch<{ c: number; d: number; dp: number; pc: number }>(
    "/quote",
    { symbol: symbol.toUpperCase() },
    60
  );
  return {
    currentPrice: data.c ?? 0,
    change: data.d ?? 0,
    percentChange: data.dp ?? 0,
    previousClose: data.pc ?? 0,
  };
}

export interface FinnhubCompanyProfile {
  name: string;
  ticker: string;
  logo: string | null;
  industry: string | null;
}

/** Returns null for unknown/OTC symbols Finnhub has no profile for (it responds with {} rather than an error). */
export async function getCompanyProfile(symbol: string): Promise<FinnhubCompanyProfile | null> {
  const data = await finnhubFetch<{ name?: string; ticker?: string; logo?: string; finnhubIndustry?: string }>(
    "/stock/profile2",
    { symbol: symbol.toUpperCase() },
    3600
  );
  if (!data.name) return null;
  return {
    name: data.name,
    ticker: data.ticker ?? symbol.toUpperCase(),
    logo: data.logo ?? null,
    industry: data.finnhubIndustry ?? null,
  };
}

export interface FinnhubNewsArticle {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  image: string | null;
  related: string;
  category: string;
}

function toDateParam(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getCompanyNews(symbol: string, daysBack = 14): Promise<FinnhubNewsArticle[]> {
  const to = new Date();
  const from = new Date(to.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const data = await finnhubFetch<FinnhubNewsArticle[]>(
    "/company-news",
    { symbol: symbol.toUpperCase(), from: toDateParam(from), to: toDateParam(to) },
    900
  );
  return Array.isArray(data) ? data : [];
}

export type FinnhubNewsCategory = "general" | "forex" | "crypto" | "merger";

export async function getGeneralNews(category: FinnhubNewsCategory = "general"): Promise<FinnhubNewsArticle[]> {
  const data = await finnhubFetch<FinnhubNewsArticle[]>("/news", { category }, 900);
  return Array.isArray(data) ? data : [];
}
