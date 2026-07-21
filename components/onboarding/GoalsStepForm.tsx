"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Target, Trash2 } from "lucide-react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { goalsStepSchema, type GoalsStepInput } from "@/lib/validations/onboarding";
import { GOAL_TYPE_LABELS } from "@/types/financial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QUICK_ADD_GOALS: { type: keyof typeof GOAL_TYPE_LABELS; defaultAmount: number }[] = [
  { type: "debt_freedom", defaultAmount: 5000 },
  { type: "emergency_fund", defaultAmount: 15000 },
  { type: "home_purchase", defaultAmount: 60000 },
  { type: "invest_more", defaultAmount: 20000 },
  { type: "retirement", defaultAmount: 500000 },
  { type: "vacation", defaultAmount: 5000 },
];

export function GoalsStepForm() {
  const router = useRouter();
  const { draft, setGoals } = useOnboarding();

  const { control, register, handleSubmit, formState: { errors } } = useForm<GoalsStepInput>({
    resolver: zodResolver(goalsStepSchema),
    defaultValues: draft.goals ?? { goals: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "goals" });
  const selectedTypes = new Set(fields.map((f) => f.type));

  function onSubmit(values: GoalsStepInput) {
    setGoals(values);
    router.push("/onboarding/review");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Target className="size-5" />
        </div>
        <CardTitle className="text-xl">What are you working toward?</CardTitle>
        <CardDescription>Pick one or more goals — you can add, edit, or remove these anytime.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {QUICK_ADD_GOALS.map((quick) => (
              <button
                key={quick.type}
                type="button"
                disabled={selectedTypes.has(quick.type)}
                onClick={() =>
                  append({
                    type: quick.type,
                    title: GOAL_TYPE_LABELS[quick.type],
                    targetAmount: quick.defaultAmount,
                    targetDate: null,
                    monthlyContribution: 0,
                  })
                }
                className="rounded-full border border-border/60 px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                + {GOAL_TYPE_LABELS[quick.type]}
              </button>
            ))}
          </div>

          {fields.length === 0 && (
            <p className="rounded-xl border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
              Pick at least one goal above to continue.
            </p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-xl border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <Input className="max-w-xs font-medium" {...register(`goals.${index}.title` as const)} />
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label>Target amount</Label>
                    <Input type="number" step="1" {...register(`goals.${index}.targetAmount` as const, { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Target date</Label>
                    <Controller
                      control={control}
                      name={`goals.${index}.targetDate` as const}
                      render={({ field: f }) => (
                        <Input
                          type="date"
                          value={f.value ? f.value.slice(0, 10) : ""}
                          onChange={(e) => f.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Monthly contribution</Label>
                    <Input type="number" step="0.01" {...register(`goals.${index}.monthlyContribution` as const, { valueAsNumber: true })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.goals?.message && <p className="text-xs text-destructive">{errors.goals.message}</p>}

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => router.push("/onboarding/assets")}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
