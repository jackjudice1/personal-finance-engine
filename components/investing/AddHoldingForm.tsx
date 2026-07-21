"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { stockHoldingFormSchema, type StockHoldingFormInput } from "@/lib/validations/stockHoldings";
import { useStockQuoteLookup } from "@/hooks/useStockQuoteLookup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";

export function AddHoldingForm({
  onSubmit,
  submitLabel = "Add position",
}: {
  onSubmit: (values: StockHoldingFormInput) => Promise<void>;
  submitLabel?: string;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StockHoldingFormInput>({
    resolver: zodResolver(stockHoldingFormSchema),
    defaultValues: { ticker: "", companyName: null, shares: 1, costBasisPerShare: 0 },
  });

  const tickerValue = useWatch({ control, name: "ticker" }) ?? "";
  const { status, preview } = useStockQuoteLookup(tickerValue);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Ticker symbol</Label>
        <Input placeholder="AAPL" {...register("ticker")} className="uppercase" />
        {errors.ticker && <p className="text-xs text-destructive">{errors.ticker.message}</p>}

        {status === "loading" && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Checking...
          </p>
        )}
        {status === "found" && preview && (
          <p className="flex items-center gap-1.5 text-xs text-primary">
            <CheckCircle2 className="size-3.5" />
            {preview.companyName ?? preview.ticker} — currently {formatCurrency(preview.currentPrice, true)}
          </p>
        )}
        {(status === "not_found" || status === "error") && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs text-warning">
              <TriangleAlert className="size-3.5" />
              {status === "not_found"
                ? "Ticker not found — you can still save this manually."
                : "Couldn't verify this ticker right now — you can still save it manually."}
            </p>
            <div className="space-y-1.5">
              <Label>Company name (optional)</Label>
              <Input placeholder="e.g. Apple Inc." {...register("companyName")} />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Shares</Label>
          <Input type="number" step="0.0001" {...register("shares", { valueAsNumber: true })} />
          {errors.shares && <p className="text-xs text-destructive">{errors.shares.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Price paid per share</Label>
          <Input type="number" step="0.01" {...register("costBasisPerShare", { valueAsNumber: true })} />
          {errors.costBasisPerShare && <p className="text-xs text-destructive">{errors.costBasisPerShare.message}</p>}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Adding a ticker you already hold merges it into that position — shares add up and cost basis averages out,
        rather than creating a duplicate entry.
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
