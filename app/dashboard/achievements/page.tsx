"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useHealthScore } from "@/hooks/useHealthScore";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useAchievements } from "@/hooks/useAchievements";
import { LevelProgressBar } from "@/components/gamification/LevelProgressBar";
import { AchievementGallery } from "@/components/gamification/AchievementGallery";
import { LevelUpToast } from "@/components/gamification/LevelUpToast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AchievementsPage() {
  const { profile, isLoading } = useFinancialProfile();
  const health = useHealthScore(profile);
  const { level, leveledUp } = useUserLevel(profile, health);
  const { unlockedKeys, newlyUnlocked } = useAchievements(profile, health);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Achievements</h1>
        <p className="text-sm text-muted-foreground">Beginner to Financial Master — track your progress.</p>
      </div>

      {isLoading || !health || !level ? (
        <Skeleton className="h-24" />
      ) : (
        <LevelProgressBar level={level} healthScore={health.overall} />
      )}

      <div>
        <h2 className="mb-3 font-medium">Badges</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <AchievementGallery unlockedKeys={unlockedKeys} />
        )}
      </div>

      <LevelUpToast leveledUp={leveledUp} level={level} newlyUnlocked={newlyUnlocked} />
    </div>
  );
}
