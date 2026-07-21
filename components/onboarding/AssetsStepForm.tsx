"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiggyBank, Plus, Trash2 } from "lucide-react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { assetsStepSchema, type AssetsStepInput } from "@/lib/validations/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ASSET_TYPE_LABELS = {
  savings: "Savings",
  checking: "Checking",
  investment: "Investments",
  retirement: "Retirement",
  real_estate: "Real Estate",
  other: "Other",
} as const;

export function AssetsStepForm() {
  const router = useRouter();
  const { draft, setAssets } = useOnboarding();

  const { control, register, handleSubmit } = useForm<AssetsStepInput>({
    resolver: zodResolver(assetsStepSchema),
    defaultValues: draft.assets ?? {
      assets: [{ type: "savings", label: "Savings account", balance: 0, isEmergencyFund: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "assets" });

  function onSubmit(values: AssetsStepInput) {
    setAssets(values);
    router.push("/onboarding/goals");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <PiggyBank className="size-5" />
        </div>
        <CardTitle className="text-xl">What have you already built?</CardTitle>
        <CardDescription>Savings, investments, retirement accounts — mark one as your emergency fund.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-xl border border-border/60 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Controller
                      control={control}
                      name={`assets.${index}.type` as const}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {(value: string) => ASSET_TYPE_LABELS[value as keyof typeof ASSET_TYPE_LABELS]}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
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
                    <Input placeholder="Emergency fund" {...register(`assets.${index}.label` as const)} />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Label>Balance</Label>
                    <Input type="number" step="0.01" {...register(`assets.${index}.balance` as const, { valueAsNumber: true })} />
                  </div>
                  <Controller
                    control={control}
                    name={`assets.${index}.isEmergencyFund` as const}
                    render={({ field: f }) => (
                      <label className="flex items-center gap-2 pb-2 text-sm text-muted-foreground">
                        <Checkbox checked={f.value} onCheckedChange={f.onChange} />
                        Emergency fund
                      </label>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
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
            onClick={() => append({ type: "savings", label: "", balance: 0, isEmergencyFund: false })}
          >
            <Plus className="size-4" />
            Add asset
          </Button>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => router.push("/onboarding/debt")}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
