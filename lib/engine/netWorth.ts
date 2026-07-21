import type { FinancialProfile } from "@/types/financial";
import type { NetWorthSummary } from "@/types/engine";

export function calculateNetWorth(profile: Pick<FinancialProfile, "totalAssets" | "totalLiabilities">): NetWorthSummary {
  return {
    totalAssets: profile.totalAssets,
    totalLiabilities: profile.totalLiabilities,
    netWorth: profile.totalAssets - profile.totalLiabilities,
  };
}
