import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";

export function GoalProgressBar({ current, target }: { current: number; target: number }) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <Progress value={pct} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatCurrency(current)}</span>
        <span>{formatCurrency(target)}</span>
      </div>
    </div>
  );
}
