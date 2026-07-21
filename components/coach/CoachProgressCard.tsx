import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function barColor(pct: number) {
  if (pct >= 70) return "bg-primary";
  if (pct >= 40) return "bg-warning";
  return "bg-destructive";
}

export function CoachProgressCard({
  icon: Icon,
  label,
  value,
  detail,
  percent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  percent: number;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4.5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold tabular-nums">{value}</p>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full transition-all", barColor(clamped))} style={{ width: `${clamped}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
