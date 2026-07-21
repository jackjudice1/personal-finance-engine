import { ExternalLink } from "lucide-react";
import type { FinnhubNewsArticle } from "@/lib/finnhub/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";

export function NewsArticleCard({ article, ticker }: { article: FinnhubNewsArticle; ticker?: string }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="flex h-full flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {ticker && (
              <Badge variant="outline" className="text-[10px]">
                {ticker}
              </Badge>
            )}
            <span>{article.source}</span>
            <span>·</span>
            <span>{formatDate(new Date(article.datetime * 1000).toISOString())}</span>
          </div>
          <p className="line-clamp-2 text-sm font-medium">{article.headline}</p>
          {article.summary && (
            <p className="line-clamp-2 flex-1 text-xs text-muted-foreground">{article.summary}</p>
          )}
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            Read more
            <ExternalLink className="size-3" />
          </span>
        </CardContent>
      </Card>
    </a>
  );
}
