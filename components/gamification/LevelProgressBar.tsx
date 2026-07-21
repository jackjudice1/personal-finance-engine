import type { UserLevel } from "@/types/database.types";
import { LEVEL_DEFINITIONS } from "@/lib/constants/levels";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export function LevelProgressBar({ level, healthScore }: { level: UserLevel; healthScore: number }) {
  const currentIndex = LEVEL_DEFINITIONS.findIndex((d) => d.level === level);
  const current = LEVEL_DEFINITIONS[currentIndex];
  const next = LEVEL_DEFINITIONS[currentIndex + 1];

  const progress = next
    ? Math.min(100, ((healthScore - current.minHealthScore) / (next.minHealthScore - current.minHealthScore)) * 100)
    : 100;

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current level</p>
            <p className="text-xl font-semibold">{current.label}</p>
          </div>
          {next && (
            <p className="text-xs text-muted-foreground">
              {next.minHealthScore - healthScore > 0 ? `${next.minHealthScore - healthScore} pts to ${next.label}` : `Almost ${next.label}`}
            </p>
          )}
        </div>
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">{current.description}</p>
      </CardContent>
    </Card>
  );
}
