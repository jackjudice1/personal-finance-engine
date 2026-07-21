"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useHealthScore } from "@/hooks/useHealthScore";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useNetWorthHistory } from "@/hooks/useNetWorthHistory";
import { useHealthScoreHistory } from "@/hooks/useHealthScoreHistory";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useAchievements } from "@/hooks/useAchievements";
import { useWidgetPreferences } from "@/hooks/useWidgetPreferences";
import { FinancialHealthScoreCard } from "@/components/dashboard/FinancialHealthScoreCard";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { HealthScoreTrendChart } from "@/components/dashboard/HealthScoreTrendChart";
import { MoneySnapshotGrid } from "@/components/dashboard/MoneySnapshotGrid";
import { RecommendationFeed } from "@/components/dashboard/RecommendationFeed";
import { LevelUpToast } from "@/components/gamification/LevelUpToast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { profile, isLoading, error } = useFinancialProfile();
  const health = useHealthScore(profile);
  const recommendations = useRecommendations(profile);
  const { history } = useNetWorthHistory(profile);
  const { history: healthScoreHistory } = useHealthScoreHistory(health);
  const { level, leveledUp } = useUserLevel(profile, health);
  const { newlyUnlocked } = useAchievements(profile, health);
  const { preferences } = useWidgetPreferences();

  if (error) {
    return <p className="text-sm text-destructive">Couldn&apos;t load your financial profile: {error}</p>;
  }

  if (isLoading || !profile || !health) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="col-span-full h-24" />
        <Skeleton className="col-span-full h-40" />
      </div>
    );
  }

  const netWorth = profile.totalAssets - profile.totalLiabilities;

  return (
    <div className="space-y-6">
      {preferences.healthScore && <FinancialHealthScoreCard health={health} />}

      {(preferences.healthScore || preferences.netWorth) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {preferences.netWorth && <NetWorthChart history={history} netWorth={netWorth} />}
          {preferences.healthScore && (
            <HealthScoreTrendChart history={healthScoreHistory} overall={health.overall} />
          )}
        </div>
      )}

      {preferences.snapshot && <MoneySnapshotGrid profile={profile} />}

      {preferences.recommendations && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Your next best moves</h2>
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard/recommendations" />}>
              View all
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
          <RecommendationFeed recommendations={recommendations} limit={3} />
        </div>
      )}

      <LevelUpToast leveledUp={leveledUp} level={level} newlyUnlocked={newlyUnlocked} />
    </div>
  );
}
