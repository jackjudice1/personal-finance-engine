"use client";

import { useParams, useRouter } from "next/navigation";
import { useGoals } from "@/hooks/useGoals";
import { GoalDetailPanel } from "@/components/goals/GoalDetailPanel";
import { Skeleton } from "@/components/ui/skeleton";
import type { GoalFormInput } from "@/lib/validations/goals";

export default function GoalDetailPage() {
  const params = useParams<{ goalId: string }>();
  const router = useRouter();
  const { goals, isLoading, updateGoal, deleteGoal } = useGoals();

  if (isLoading) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  const goal = goals.find((g) => g.id === params.goalId);

  if (!goal) {
    return <p className="text-sm text-muted-foreground">Goal not found.</p>;
  }

  async function handleUpdate(values: GoalFormInput) {
    await updateGoal(goal!.id, values);
    router.push("/dashboard/goals");
  }

  async function handleDelete() {
    await deleteGoal(goal!.id);
  }

  return <GoalDetailPanel goal={goal} onUpdate={handleUpdate} onDelete={handleDelete} />;
}
