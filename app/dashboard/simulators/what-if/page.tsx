"use client";

import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { WhatIfSimulator } from "@/components/simulators/WhatIfSimulator";
import { Skeleton } from "@/components/ui/skeleton";

export default function WhatIfPage() {
  const { profile, isLoading } = useFinancialProfile();

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold">What-If Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Adjust your income, expenses, and contributions to see your projected net worth change.
        </p>
      </div>
      {isLoading || !profile ? <Skeleton className="h-96" /> : <WhatIfSimulator profile={profile} />}
    </div>
  );
}
