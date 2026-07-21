"use client";

import { useEffect, useState } from "react";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { FinnhubNewsArticle } from "@/lib/finnhub/client";
import type { TickerNewsArticle } from "@/app/api/news/holdings/route";

export function useNewsFeed() {
  const { user } = useSupabaseUser();
  const [generalArticles, setGeneralArticles] = useState<FinnhubNewsArticle[]>([]);
  const [holdingsArticles, setHoldingsArticles] = useState<TickerNewsArticle[]>([]);
  const [lean, setLean] = useState<"debt" | "investing" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      try {
        const [generalRes, holdingsRes] = await Promise.all([
          fetch("/api/news/general"),
          fetch("/api/news/holdings"),
        ]);

        if (cancelled) return;

        if (!generalRes.ok) {
          const body = await generalRes.json().catch(() => ({}));
          throw new Error(body.error ?? "Couldn't load news.");
        }

        const generalData = await generalRes.json();
        const holdingsData = holdingsRes.ok ? await holdingsRes.json() : { articles: [] };

        if (cancelled) return;
        setGeneralArticles(generalData.articles ?? []);
        setLean(generalData.lean ?? null);
        setHoldingsArticles(holdingsData.articles ?? []);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Couldn't load news.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { generalArticles, holdingsArticles, lean, isLoading, error };
}
