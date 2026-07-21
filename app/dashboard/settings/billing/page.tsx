"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { usePremiumGate } from "@/hooks/usePremiumGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const PREMIUM_FEATURES = [
  "AI financial assistant",
  "Advanced what-if simulations",
  "Unlimited goals",
  "Long-range wealth projections",
  "Personalized, prioritized recommendations",
];

export default function BillingPage() {
  const { isPremium, isLoading } = usePremiumGate();
  const [isUpgrading, setIsUpgrading] = useState(false);

  async function handleUpgrade() {
    setIsUpgrading(true);
    // No Stripe integration yet - this is the seam where a real checkout
    // session would be created (see lib/stripe/client.ts).
    await new Promise((r) => setTimeout(r, 400));
    toast.info("Billing isn't connected yet", {
      description: "This app doesn't have Stripe wired up — see lib/stripe/ for the integration seam.",
    });
    setIsUpgrading(false);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your plan.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>{isPremium ? "$9.99/month" : "Free forever"}</CardDescription>
            </div>
            <Badge className={isPremium ? "bg-premium text-premium-foreground" : undefined} variant={isPremium ? undefined : "outline"}>
              {isPremium ? "Premium" : "Free"}
            </Badge>
          </CardHeader>
          {!isPremium && (
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={handleUpgrade} disabled={isUpgrading}>
                <Sparkles className="size-4" />
                Upgrade to Premium
              </Button>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
