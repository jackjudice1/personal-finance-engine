"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Film, Heart, Home, Receipt, ShieldPlus, UtensilsCrossed, Wallet2 } from "lucide-react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { expensesStepSchema, type ExpensesStepInput } from "@/lib/validations/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORY_META = {
  housing: { label: "Housing", icon: Home },
  transportation: { label: "Transportation", icon: Car },
  food: { label: "Food", icon: UtensilsCrossed },
  subscriptions: { label: "Subscriptions", icon: Receipt },
  insurance: { label: "Insurance", icon: ShieldPlus },
  healthcare: { label: "Healthcare", icon: Heart },
  entertainment: { label: "Entertainment", icon: Film },
  other: { label: "Other", icon: Wallet2 },
} as const;

export function ExpensesStepForm() {
  const router = useRouter();
  const { draft, setExpenses } = useOnboarding();

  const { register, handleSubmit } = useForm<ExpensesStepInput>({
    resolver: zodResolver(expensesStepSchema),
    defaultValues: draft.expenses ?? {
      expenses: {
        housing: 0,
        transportation: 0,
        food: 0,
        subscriptions: 0,
        insurance: 0,
        healthcare: 0,
        entertainment: 0,
        other: 0,
      },
    },
  });

  function onSubmit(values: ExpensesStepInput) {
    setExpenses(values);
    router.push("/onboarding/debt");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Receipt className="size-5" />
        </div>
        <CardTitle className="text-xl">Where&apos;s it going?</CardTitle>
        <CardDescription>Monthly amounts — leave anything that doesn&apos;t apply at $0.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map((category) => {
              const meta = CATEGORY_META[category];
              return (
                <div key={category} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <meta.icon className="size-4.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">{meta.label}</Label>
                    <Input type="number" step="0.01" {...register(`expenses.${category}` as const, { valueAsNumber: true })} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => router.push("/onboarding/income")}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
