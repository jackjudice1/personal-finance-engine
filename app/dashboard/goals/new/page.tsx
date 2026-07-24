"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoals } from "@/hooks/useGoals";
import { GoalForm } from "@/components/goals/GoalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GoalFormInput } from "@/lib/validations/goals";

export default function NewGoalPage() {
  const router = useRouter();
  const { createGoal, isLoading } = useGoals();

  async function handleSubmit(values: GoalFormInput) {
    try {
      await createGoal(values);
      router.push("/dashboard/goals");
    } catch {
      toast.error("Couldn't save this goal. Please try again.");
    }
  }

  if (isLoading) {
    return null;
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
