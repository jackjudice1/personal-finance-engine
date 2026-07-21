"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { logPaymentSchema, type LogPaymentInput } from "@/lib/validations/debtPayment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";

export function LogPaymentForm({
  currentBalance,
  onSubmit,
}: {
  currentBalance: number;
  onSubmit: (values: LogPaymentInput) => Promise<void>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LogPaymentInput>({
    resolver: zodResolver(logPaymentSchema),
    defaultValues: { amount: 0, paidAt: new Date().toISOString().slice(0, 10) },
  });

  async function submit(values: LogPaymentInput) {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Couldn't log that payment.");
    }
  }

  if (currentBalance <= 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Payment amount</Label>
          <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
          {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" {...register("paidAt")} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setValue("amount", currentBalance, { shouldValidate: true })}
        className="text-xs font-medium text-primary hover:underline"
      >
        Pay off remaining balance ({formatCurrency(currentBalance)})
      </button>

      {serverError && <p className="text-xs text-destructive">{serverError}</p>}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Log payment
        </Button>
      </div>
    </form>
  );
}
