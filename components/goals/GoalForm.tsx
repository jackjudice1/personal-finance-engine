"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { goalFormSchema, type GoalFormInput } from "@/lib/validations/goals";
import { GOAL_TYPE_LABELS } from "@/types/financial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GoalForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save goal",
}: {
  defaultValues?: Partial<GoalFormInput>;
  onSubmit: (values: GoalFormInput) => Promise<void>;
  submitLabel?: string;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormInput>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      type: "custom",
      title: "",
      targetAmount: 1000,
      currentAmount: 0,
      targetDate: null,
      monthlyContribution: 0,
      priority: 3,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Goal type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>{(value: string) => GOAL_TYPE_LABELS[value as keyof typeof GOAL_TYPE_LABELS]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GOAL_TYPE_LABELS).map(([value, label]) => (
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
          <Label>Title</Label>
          <Input {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Target amount</Label>
          <Input type="number" step="1" {...register("targetAmount", { valueAsNumber: true })} />
          {errors.targetAmount && <p className="text-xs text-destructive">{errors.targetAmount.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Current amount</Label>
          <Input type="number" step="1" {...register("currentAmount", { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <Label>Monthly contribution</Label>
          <Input type="number" step="1" {...register("monthlyContribution", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Target date</Label>
          <Controller
            control={control}
            name="targetDate"
            render={({ field }) => (
              <Input
                type="date"
                value={field.value ? field.value.slice(0, 10) : ""}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Priority (1 = highest)</Label>
          <Input type="number" min={1} max={5} {...register("priority", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
