"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Trophy, Award } from "lucide-react";
import type { UserLevel } from "@/types/database.types";
import type { AchievementDefinition } from "@/types/gamification";
import { LEVEL_DEFINITIONS } from "@/lib/constants/levels";

export function LevelUpToast({
  leveledUp,
  level,
  newlyUnlocked,
}: {
  leveledUp: boolean;
  level: UserLevel | null;
  newlyUnlocked: AchievementDefinition[];
}) {
  useEffect(() => {
    if (leveledUp && level) {
      const def = LEVEL_DEFINITIONS.find((d) => d.level === level);
      toast(`Level up: ${def?.label ?? level}`, {
        icon: <Trophy className="size-4 text-premium" />,
        description: def?.description,
      });
    }
  }, [leveledUp, level]);

  useEffect(() => {
    newlyUnlocked.forEach((achievement) => {
      toast(`Achievement unlocked: ${achievement.title}`, {
        icon: <Award className="size-4 text-primary" />,
        description: achievement.description,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newlyUnlocked.length]);

  return null;
}
