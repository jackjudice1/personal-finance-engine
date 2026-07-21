import type { UserLevel } from "@/types/database.types";
import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown } from "@/types/engine";

export interface LevelDefinition {
  level: UserLevel;
  label: string;
  description: string;
  minHealthScore: number;
}

export interface AchievementDefinition {
  key: string;
  title: string;
  description: string;
  icon: string; // lucide-react icon name
  predicate: (profile: FinancialProfile, health: HealthScoreBreakdown) => boolean;
}

export interface UnlockedAchievement {
  key: string;
  unlockedAt: string;
}
