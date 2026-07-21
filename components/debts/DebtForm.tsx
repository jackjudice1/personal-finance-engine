"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { debtFormSchema, type DebtFormInput } from "@/lib/validations/debts";
import { LIABILITY_TYPE_LABELS } from "@/types/financial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DebtForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save debt",
}: {
  defaultValues?: Partial<DebtFormInput>;
  onSubmit: (values: DebtFormInput) => Promise<void>;
  submitLabel?: string;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DebtFormInput>({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      type: "credit_card",
      label: "",
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>{(value: string) => LIABILITY_TYPE_LABELS[value as keyof typeof LIABILITY_TYPE_LABELS]}</SelectValue>
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
          <Input placeholder="Visa" {...register("label")} />
          {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Balance</Label>
          <Input type="number" step="0.01" {...register("balance", { valueAsNumber: true })} />
          {errors.balance && <p className="text-xs text-destructive">{errors.balance.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Interest rate (APR %)</Label>
          <Input type="number" step="0.01" {...register("interestRate", { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <Label>Min. payment</Label>
          <Input type="number" step="0.01" {...register("minimumPayment", { valueAsNumber: true })} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Editing the balance here won&apos;t show up on your payoff chart — use &ldquo;Log a payment&rdquo; below to
        track paydown history.
      </p>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
