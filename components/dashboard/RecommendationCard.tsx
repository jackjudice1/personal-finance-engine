import { AlertTriangle, Info, TrendingUp, X } from "lucide-react";
import type { Recommendation } from "@/types/engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SEVERITY_META = {
  urgent: { icon: AlertTriangle, className: "text-destructive" },
  suggested: { icon: TrendingUp, className: "text-primary" },
  info: { icon: Info, className: "text-muted-foreground" },
} as const;

export function RecommendationCard({
  recommendation,
  onDismiss,
}: {
  recommendation: Recommendation;
  onDismiss?: () => void;
}) {
  const meta = SEVERITY_META[recommendation.severity];
  const Icon = meta.icon;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
      <Icon className={cn("mt-0.5 size-4.5 shrink-0", meta.className)} />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{recommendation.title}</p>
          <Badge variant="outline" className="text-[10px] capitalize">
            {recommendation.severity}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{recommendation.description}</p>
      </div>
      {onDismiss && (
        <Button variant="ghost" size="icon-sm" onClick={onDismiss} aria-label="Dismiss">
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
