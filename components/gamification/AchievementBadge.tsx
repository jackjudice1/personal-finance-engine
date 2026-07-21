import { Award, HeartPulse, PercentCircle, PiggyBank, ShieldCheck, Swords, TrendingUp } from "lucide-react";
import type { AchievementDefinition } from "@/types/gamification";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, typeof Award> = {
  PiggyBank,
  Swords,
  TrendingUp,
  PercentCircle,
  ShieldCheck,
  HeartPulse,
};

export function AchievementBadge({
  achievement,
  unlocked,
}: {
  achievement: AchievementDefinition;
  unlocked: boolean;
}) {
  const Icon = ICON_MAP[achievement.icon] ?? Award;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-opacity",
        unlocked ? "border-primary/40 bg-accent/40" : "border-border/60 opacity-50"
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full",
          unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-6" />
      </div>
      <p className="text-sm font-medium">{achievement.title}</p>
      <p className="text-xs text-muted-foreground">{achievement.description}</p>
    </div>
  );
}
