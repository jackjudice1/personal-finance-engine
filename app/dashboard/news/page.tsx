"use client";

import { useNewsFeed } from "@/hooks/useNewsFeed";
import { NewsFeedSection } from "@/components/news/NewsFeedSection";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsPage() {
  const { generalArticles, holdingsArticles, isLoading, error } = useNewsFeed();

  if (error) {
    return <p className="text-sm text-destructive">Couldn&apos;t load news: {error}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">News</h1>
        <p className="text-sm text-muted-foreground">
          Market news, prioritized for you — plus updates on the stocks you actually hold.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <>
          <NewsFeedSection
            title="Market news, prioritized for you"
            description="Filtered from general market news based on your current financial focus — not a perfectly curated feed, just the closest matches we could find."
            articles={generalArticles}
            emptyMessage="No matching articles right now — check back later."
          />
          <NewsFeedSection
            title="News for your holdings"
            description="Company-specific news for the stocks in your portfolio."
            articles={holdingsArticles}
            emptyMessage="Add a stock position to see news for it here."
          />
        </>
      )}
    </div>
  );
}
