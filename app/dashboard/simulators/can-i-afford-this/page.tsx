"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { CanIAffordThisForm } from "@/components/simulators/CanIAffordThisForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function CanIAffordThisPage() {
  const { profile, isLoading } = useFinancialProfile();

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Can I Afford This?</h1>
        <p className="text-sm text-muted-foreground">See the real impact of a purchase before you make it.</p>
      </div>
      {isLoading || !profile ? <Skeleton className="h-64" /> : <CanIAffordThisForm profile={profile} />}
    </div>
  );
}
