import { ACHIEVEMENT_DEFINITIONS } from "@/lib/constants/achievements";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";

export function AchievementGallery({ unlockedKeys }: { unlockedKeys: Set<string> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {ACHIEVEMENT_DEFINITIONS.map((achievement) => (
        <AchievementBadge key={achievement.key} achievement={achievement} unlocked={unlockedKeys.has(achievement.key)} />
      ))}
    </div>
  );
}
