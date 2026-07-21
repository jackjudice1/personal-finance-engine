"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useHealthScore } from "@/hooks/useHealthScore";
import { CoachChatWindow } from "@/components/coach/CoachChatWindow";
import { FinancialDisclaimerBanner } from "@/components/shared/FinancialDisclaimerBanner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoachPage() {
  const { profile, isLoading, error } = useFinancialProfile();
  const health = useHealthScore(profile);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">AI Financial Coach</h1>
        <p className="text-sm text-muted-foreground">Ask anything about your finances.</p>
      </div>

      <FinancialDisclaimerBanner />

      {error && <p className="text-sm text-destructive">Couldn&apos;t load your financial profile: {error}</p>}

      {!error && (isLoading || !profile || !health) && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96 max-w-2xl" />
        </div>
      )}

      {!error && profile && health && <CoachChatWindow profile={profile} health={health} />}
    </div>
  );
}
