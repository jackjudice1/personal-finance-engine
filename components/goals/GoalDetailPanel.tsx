"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Goal } from "@/types/financial";
import type { GoalFormInput } from "@/lib/validations/goals";
import { projectGoal } from "@/lib/engine/goalProjections";
import { GoalForm } from "@/components/goals/GoalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function GoalDetailPanel({
  goal,
  onUpdate,
  onDelete,
}: {
  goal: Goal;
  onUpdate: (values: GoalFormInput) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const projection = projectGoal(goal);

  async function handleDelete() {
    setIsDeleting(true);
    await onDelete();
    router.push("/dashboard/goals");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Required monthly pace</p>
            <p className="text-lg font-semibold">{formatCurrency(projection.monthlyContributionNeeded)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Projected completion</p>
            <p className="text-lg font-semibold">
              {projection.projectedPayoffDate ? formatDate(projection.projectedPayoffDate) : "Add a monthly amount"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className={`text-lg font-semibold ${projection.onTrack ? "text-primary" : "text-destructive"}`}>
              {projection.onTrack ? "On track" : "Behind pace"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit goal</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalForm
            defaultValues={{
              type: goal.type,
              title: goal.title,
              targetAmount: goal.targetAmount,
              currentAmount: goal.currentAmount,
              targetDate: goal.targetDate,
              monthlyContribution: goal.monthlyContribution,
              priority: goal.priority,
            }}
            onSubmit={onUpdate}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="size-4" />
          Delete goal
        </Button>
      </div>
    </div>
  );
}
