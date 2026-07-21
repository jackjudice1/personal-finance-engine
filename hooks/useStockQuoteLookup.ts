"use client";

import { useEffect, useState } from "react";

export interface StockQuotePreview {
  ticker: string;
  companyName: string | null;
  currentPrice: number;
  change: number;
  percentChange: number;
}

type LookupStatus = "idle" | "loading" | "found" | "not_found" | "error";

const DEBOUNCE_MS = 400;

/** Debounced live ticker lookup for the add-position form's preview - separate from useStockHoldings so the form can show "checking.../not found" without touching persisted data. */
export function useStockQuoteLookup(ticker: string) {
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [preview, setPreview] = useState<StockQuotePreview | null>(null);

  useEffect(() => {
    const trimmed = ticker.trim();
    if (!trimmed) {
      setStatus("idle");
      setPreview(null);
      return;
    }

    setStatus("loading");
    let cancelled = false;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stocks/quote?symbol=${encodeURIComponent(trimmed)}`);
        if (cancelled) return;

        if (res.status === 404) {
          setStatus("not_found");
          setPreview(null);
          return;
        }
        if (!res.ok) {
          setStatus("error");
          setPreview(null);
          return;
        }

        const data = await res.json();
        setStatus("found");
        setPreview(data);
      } catch {
        if (!cancelled) {
          setStatus("error");
          setPreview(null);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [ticker]);

  return { status, preview };
}
