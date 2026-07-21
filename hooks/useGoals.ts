"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import type { Goal } from "@/types/financial";
import type { GoalFormInput } from "@/lib/validations/goals";

function mapRow(row: {
  id: string;
  type: Goal["type"];
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  monthly_contribution: number | null;
  priority: number;
  status: Goal["status"];
}): Goal {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    targetDate: row.target_date,
    monthlyContribution: Number(row.monthly_contribution ?? 0),
    priority: row.priority,
    status: row.status,
  };
}

export function useGoals() {
  const { user } = useSupabaseUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setRefetchToken((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id)
        .order("priority", { ascending: true });
      if (cancelled) return;
      setGoals((data ?? []).map(mapRow));
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, refetchToken]);

  async function createGoal(input: GoalFormInput) {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("goals").insert({
      user_id: user.id,
      type: input.type,
      title: input.title,
      target_amount: input.targetAmount,
      current_amount: input.currentAmount,
      target_date: input.targetDate ? input.targetDate.slice(0, 10) : null,
      monthly_contribution: input.monthlyContribution,
      priority: input.priority,
    });
    refetch();
  }

  async function updateGoal(goalId: string, input: GoalFormInput) {
    const supabase = createClient();
    await supabase
      .from("goals")
      .update({
        type: input.type,
        title: input.title,
        target_amount: input.targetAmount,
        current_amount: input.currentAmount,
        target_date: input.targetDate ? input.targetDate.slice(0, 10) : null,
        monthly_contribution: input.monthlyContribution,
        priority: input.priority,
      })
      .eq("id", goalId);
    refetch();
  }

  async function deleteGoal(goalId: string) {
    const supabase = createClient();
    await supabase.from("goals").delete().eq("id", goalId);
    refetch();
  }

  return { goals, isLoading, refetch, createGoal, updateGoal, deleteGoal };
}
