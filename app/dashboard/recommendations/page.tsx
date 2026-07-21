"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationFeed } from "@/components/dashboard/RecommendationFeed";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecommendationsPage() {
  const { profile, isLoading } = useFinancialProfile();
  const recommendations = useRecommendations(profile);

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          Every suggestion the decision engine has for your current numbers, ranked by urgency.
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (
        <RecommendationFeed recommendations={recommendations} dismissible />
      )}
    </div>
  );
}
