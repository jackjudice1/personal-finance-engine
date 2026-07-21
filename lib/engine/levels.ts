import type { UserLevel } from "@/types/database.types";
import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown } from "@/types/engine";
import { LEVEL_DEFINITIONS } from "@/lib/constants/levels";

/**
 * Derives the user's level from health score plus a couple of qualitative
 * gates (per LEVEL_DEFINITIONS' descriptions) so a high score alone can't
 * skip the "has any investment" or "positive net worth" milestones.
 */
export function deriveLevel(profile: FinancialProfile, health: HealthScoreBreakdown): UserLevel {
  const netWorth = profile.totalAssets - profile.totalLiabilities;
  const hasEmergencyMonth = profile.emergencyFundBalance >= profile.monthlyExpenses;
  const hasInvestment = profile.totalInvestmentAssets > 0;

  let level: UserLevel = "beginner";

  for (const def of LEVEL_DEFINITIONS) {
    if (health.overall < def.minHealthScore) break;

    if (def.level === "saver" && !hasEmergencyMonth) break;
    if (def.level === "investor" && !hasInvestment) break;
    if (def.level === "wealth_builder" && netWorth <= 0) break;

    level = def.level;
  }

  return level;
}
