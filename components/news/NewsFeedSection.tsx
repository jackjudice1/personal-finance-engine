import type { ReactNode } from "react";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import type { FinnhubNewsArticle } from "@/lib/finnhub/client";

interface ArticleWithOptionalTicker extends FinnhubNewsArticle {
  ticker?: string;
}

export function NewsFeedSection({
  title,
  description,
  articles,
  emptyMessage,
}: {
  title: string;
  description?: ReactNode;
  articles: ArticleWithOptionalTicker[];
  emptyMessage: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-medium">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsArticleCard key={`${article.id}-${article.ticker ?? ""}`} article={article} ticker={article.ticker} />
          ))}
        </div>
      )}
    </div>
  );
}
