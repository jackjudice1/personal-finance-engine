"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm, Controller, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Wallet } from "lucide-react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { incomeStepSchema, type IncomeStepInput } from "@/lib/validations/onboarding";
import { toNetAmount } from "@/types/financial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/formatters";

const FREQUENCY_LABELS = { weekly: "Weekly", biweekly: "Biweekly", monthly: "Monthly", annually: "Annually" } as const;
const FREQUENCY_NOUN = { weekly: "week", biweekly: "paycheck", monthly: "month", annually: "year" } as const;

/** Live "≈ $X net per paycheck" readout - scoped with useWatch so typing in one row doesn't re-render the others. */
function NetPreview({ control, index }: { control: Control<IncomeStepInput>; index: number }) {
  const amount = useWatch({ control, name: `incomeSources.${index}.amount` });
  const frequency = useWatch({ control, name: `incomeSources.${index}.frequency` });
  const deductionRate = useWatch({ control, name: `incomeSources.${index}.deductionRate` });

  if (!deductionRate || !amount) {
    return <p className="text-xs text-muted-foreground">Leave blank if this amount is already your take-home pay.</p>;
  }

  return (
    <p className="text-xs text-muted-foreground">
      ≈ <span className="font-medium text-foreground">{formatCurrency(toNetAmount(amount, deductionRate))}</span> net per{" "}
      {FREQUENCY_NOUN[frequency]} after an estimated {deductionRate}% taken out.
    </p>
  );
}

export function IncomeStepForm() {
  const router = useRouter();
  const { draft, setIncome } = useOnboarding();

  const { control, register, handleSubmit, formState: { errors } } = useForm<IncomeStepInput>({
    resolver: zodResolver(incomeStepSchema),
    defaultValues: draft.income ?? {
      incomeSources: [{ label: "Salary", amount: 0, frequency: "monthly", isPrimary: true, deductionRate: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "incomeSources" });

  function onSubmit(values: IncomeStepInput) {
    setIncome(values);
    router.push("/onboarding/expenses");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Wallet className="size-5" />
        </div>
        <CardTitle className="text-xl">What&apos;s coming in?</CardTitle>
        <CardDescription>Add every source of income — we&apos;ll normalize it all to a monthly figure.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-xl border border-border/60 p-4">
                <div className="grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                  <div className="space-y-1.5">
                    <Label>Source</Label>
                    <Input placeholder="Salary" {...register(`incomeSources.${index}.label` as const)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Amount</Label>
                    <Input type="number" step="0.01" {...register(`incomeSources.${index}.amount` as const, { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Frequency</Label>
                    <Controller
                      control={control}
                      name={`incomeSources.${index}.frequency` as const}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue>{(value: string) => FREQUENCY_LABELS[value as keyof typeof FREQUENCY_LABELS]}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex items-end justify-end sm:col-start-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-[8rem_1fr] items-end gap-3">
                  <div className="space-y-1.5">
                    <Label>Est. tax/deductions %</Label>
                    <Controller
                      control={control}
                      name={`incomeSources.${index}.deductionRate` as const}
                      render={({ field: f }) => (
                        <Input
                          type="number"
                          step="1"
                          min={0}
                          max={100}
                          placeholder="Optional"
                          value={f.value ?? ""}
                          onChange={(e) => f.onChange(e.target.value === "" ? null : Number(e.target.value))}
                        />
                      )}
                    />
                  </div>
                  <NetPreview control={control} index={index} />
                </div>
              </div>
            ))}
          </div>
          {errors.incomeSources?.message && (
            <p className="text-xs text-destructive">{errors.incomeSources.message}</p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ label: "", amount: 0, frequency: "monthly", isPrimary: false, deductionRate: null })}
          >
            <Plus className="size-4" />
            Add another income source
          </Button>

          <div className="flex justify-end pt-2">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
