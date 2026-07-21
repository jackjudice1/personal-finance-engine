"use client";

import Link from "next/link";
import { Plus, Target } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsPage() {
  const { goals, isLoading } = useGoals();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Goals</h1>
          <p className="text-sm text-muted-foreground">Track progress toward what you&apos;re building.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/dashboard/goals/new" />}>
          <Plus className="size-4" />
          New goal
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 p-12 text-center">
          <Target className="size-8 text-muted-foreground" />
          <p className="font-medium">No goals yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add a goal — house, debt freedom, retirement — and the engine will tell you what pace keeps you on track.
          </p>
          <Button className="mt-2" nativeButton={false} render={<Link href="/dashboard/goals/new" />}>
            <Plus className="size-4" />
            Create your first goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
