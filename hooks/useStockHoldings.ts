"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { StockHolding } from "@/types/financial";
import type { StockHoldingFormInput } from "@/lib/validations/stockHoldings";

function mapRow(row: {
  id: string;
  ticker: string;
  company_name: string | null;
  shares: number;
  cost_basis_per_share: number;
  last_price: number | null;
  last_price_fetched_at: string | null;
}): StockHolding {
  return {
    id: row.id,
    ticker: row.ticker,
    companyName: row.company_name,
    shares: Number(row.shares),
    costBasisPerShare: Number(row.cost_basis_per_share),
    lastPrice: row.last_price === null ? null : Number(row.last_price),
    lastPriceFetchedAt: row.last_price_fetched_at,
  };
}

interface QuoteLookupResult {
  companyName: string | null;
  currentPrice: number | null;
}

/** Best-effort ticker lookup - falls back to "no live data" rather than throwing, since manual-entry saves are allowed (see lib/validations/stockHoldings.ts). */
async function tryLookupQuote(ticker: string): Promise<QuoteLookupResult> {
  try {
    const res = await fetch(`/api/stocks/quote?symbol=${encodeURIComponent(ticker)}`);
    if (!res.ok) return { companyName: null, currentPrice: null };
    const data = await res.json();
    return { companyName: data.companyName ?? null, currentPrice: data.currentPrice ?? null };
  } catch {
    return { companyName: null, currentPrice: null };
  }
}

export function useStockHoldings() {
  const { user } = useSupabaseUser();
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setRefetchToken((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("stock_holdings")
        .select("*")
        .eq("user_id", user!.id)
        .order("ticker", { ascending: true });
      if (cancelled) return;
      setHoldings((data ?? []).map(mapRow));
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, refetchToken]);

  /** Adding an already-held ticker merges into the existing position (summed shares, weighted-average cost basis) rather than creating a duplicate row. */
  async function createHolding(input: StockHoldingFormInput) {
    if (!user) return;
    const supabase = createClient();
    const quote = await tryLookupQuote(input.ticker);

    const existing = holdings.find((h) => h.ticker === input.ticker);

    if (existing) {
      const newShares = existing.shares + input.shares;
      const newCostBasisPerShare =
        (existing.shares * existing.costBasisPerShare + input.shares * input.costBasisPerShare) / newShares;

      await supabase
        .from("stock_holdings")
        .update({
          shares: newShares,
          cost_basis_per_share: newCostBasisPerShare,
          ...(quote.companyName ? { company_name: quote.companyName } : {}),
          ...(quote.currentPrice !== null
            ? { last_price: quote.currentPrice, last_price_fetched_at: new Date().toISOString() }
            : {}),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("stock_holdings").insert({
        user_id: user.id,
        ticker: input.ticker,
        company_name: quote.companyName ?? input.companyName,
        shares: input.shares,
        cost_basis_per_share: input.costBasisPerShare,
        last_price: quote.currentPrice,
        last_price_fetched_at: quote.currentPrice !== null ? new Date().toISOString() : null,
      });
    }

    refetch();
  }

  async function deleteHolding(holdingId: string) {
    const supabase = createClient();
    await supabase.from("stock_holdings").delete().eq("id", holdingId);
    refetch();
  }

  async function refreshPrices() {
    await fetch("/api/stocks/refresh", { method: "POST" });
    refetch();
  }

  return { holdings, isLoading, refetch, createHolding, deleteHolding, refreshPrices };
}
