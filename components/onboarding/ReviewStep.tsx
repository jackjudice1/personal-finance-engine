"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { GOAL_TYPE_LABELS } from "@/types/financial";

export function ReviewStep() {
  const router = useRouter();
  const { draft } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!draft.income) router.replace("/onboarding/income");
    else if (!draft.expenses) router.replace("/onboarding/expenses");
    else if (!draft.debt) router.replace("/onboarding/debt");
    else if (!draft.assets) router.replace("/onboarding/assets");
    else if (!draft.goals) router.replace("/onboarding/goals");
  }, [draft, router]);

  if (!draft.income || !draft.expenses || !draft.debt || !draft.assets || !draft.goals) {
    return null;
  }

  const totalMonthlyIncome = draft.income.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  const totalMonthlyExpenses = Object.values(draft.expenses.expenses).reduce((sum, v) => sum + v, 0);
  const totalDebt = draft.debt.liabilities.reduce((sum, l) => sum + l.balance, 0);
  const totalAssets = draft.assets.assets.reduce((sum, a) => sum + a.balance, 0);

  async function handleFinish() {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong saving your profile.");
      }
      router.push("/onboarding/complete");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">You&apos;re all set — let&apos;s confirm</CardTitle>
        <CardDescription>Here&apos;s the snapshot we&apos;ll build your Financial Health Score from.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Monthly income</p>
            <p className="text-lg font-semibold">{formatCurrency(totalMonthlyIncome)}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Monthly expenses</p>
            <p className="text-lg font-semibold">{formatCurrency(totalMonthlyExpenses)}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Total debt</p>
            <p className="text-lg font-semibold">{formatCurrency(totalDebt)}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Total assets</p>
            <p className="text-lg font-semibold">{formatCurrency(totalAssets)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Goals</p>
          <ul className="space-y-1.5">
            {draft.goals.goals.map((goal) => (
              <li key={goal.type + goal.title} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                <span>{goal.title || GOAL_TYPE_LABELS[goal.type]}</span>
                <span className="text-muted-foreground">{formatCurrency(goal.targetAmount)}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={() => router.push("/onboarding/goals")} disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={handleFinish} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            <CheckCircle2 className="size-4" />
            Finish setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
