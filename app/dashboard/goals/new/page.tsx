"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { usePremiumGate } from "@/hooks/usePremiumGate";
import { GoalForm } from "@/components/goals/GoalForm";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GoalFormInput } from "@/lib/validations/goals";

/** Matches the "Up to 3 active goals" limit advertised on the Free plan. */
const FREE_TIER_GOAL_LIMIT = 3;

export default function NewGoalPage() {
  const router = useRouter();
  const { goals, createGoal, isLoading } = useGoals();
  const { isPremium, isLoading: isPremiumLoading } = usePremiumGate();
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSubmit(values: GoalFormInput) {
    await createGoal(values);
    router.push("/dashboard/goals");
  }

  const atFreeLimit = !isPremium && goals.length >= FREE_TIER_GOAL_LIMIT;

  if (isLoading || isPremiumLoading) {
    return null;
  }

  if (atFreeLimit) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-premium/15 text-premium">
            <Sparkles className="size-5" />
          </div>
          <p className="font-medium">You&apos;ve reached the Free plan&apos;s {FREE_TIER_GOAL_LIMIT}-goal limit</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Upgrade to Premium for unlimited goals, or remove an existing goal to add a new one.
          </p>
          <Button onClick={() => setModalOpen(true)}>Upgrade to Premium</Button>
        </CardContent>
        <UpgradeModal open={modalOpen} onOpenChange={setModalOpen} />
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>New goal</CardTitle>
      </CardHeader>
      <CardContent>
        <GoalForm onSubmit={handleSubmit} submitLabel="Create goal" />
      </CardContent>
    </Card>
  );
}
