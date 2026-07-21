"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { debtStepSchema, type DebtStepInput } from "@/lib/validations/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LIABILITY_TYPE_LABELS = {
  credit_card: "Credit Card",
  student_loan: "Student Loan",
  auto_loan: "Auto Loan",
  mortgage: "Mortgage",
  personal_loan: "Personal Loan",
  other: "Other",
} as const;

export function DebtStepForm() {
  const router = useRouter();
  const { draft, setDebt } = useOnboarding();

  const { control, register, handleSubmit } = useForm<DebtStepInput>({
    resolver: zodResolver(debtStepSchema),
    defaultValues: draft.debt ?? { liabilities: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "liabilities" });

  function onSubmit(values: DebtStepInput) {
    setDebt(values);
    router.push("/onboarding/assets");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <CreditCard className="size-5" />
        </div>
        <CardTitle className="text-xl">Any debt to plan around?</CardTitle>
        <CardDescription>Credit cards, student loans, auto loans — interest rate matters a lot here.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {fields.length === 0 && (
            <p className="rounded-xl border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
              No debt added. Nice. Add one if that changes, or continue.
            </p>
          )}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-xl border border-border/60 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Controller
                      control={control}
                      name={`liabilities.${index}.type` as const}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(LIABILITY_TYPE_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input placeholder="Visa" {...register(`liabilities.${index}.label` as const)} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label>Balance</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`liabilities.${index}.balance` as const, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Interest rate (APR %)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`liabilities.${index}.interestRate` as const, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Min. payment</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`liabilities.${index}.minimumPayment` as const, { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ type: "credit_card", label: "", balance: 0, interestRate: 0, minimumPayment: 0 })
            }
          >
            <Plus className="size-4" />
            Add debt
          </Button>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => router.push("/onboarding/expenses")}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
