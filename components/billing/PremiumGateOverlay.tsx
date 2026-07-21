"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { usePremiumGate } from "@/hooks/usePremiumGate";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { Skeleton } from "@/components/ui/skeleton";

export function PremiumGateOverlay({
  children,
  title = "Premium feature",
  description = "Upgrade to unlock this.",
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const { isPremium, isLoading } = usePremiumGate();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) return <Skeleton className="h-48" />;
  if (isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/70 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-premium/15 text-premium">
          <Lock className="size-5" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Upgrade to Premium</Button>
      </div>
      <UpgradeModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
