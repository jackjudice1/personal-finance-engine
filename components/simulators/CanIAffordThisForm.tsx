"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { FinancialProfile } from "@/types/financial";
import { canIAffordThis } from "@/lib/simulators/canIAffordThis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatPercent } from "@/utils/formatters";

export function CanIAffordThisForm({ profile }: { profile: FinancialProfile }) {
  const [purchasePrice, setPurchasePrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [monthlyPayment, setMonthlyPayment] = useState(500);

  const result = useMemo(
    () => canIAffordThis({ purchasePrice, downPayment, monthlyPayment }, profile),
    [purchasePrice, downPayment, monthlyPayment, profile]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Purchase price</Label>
          <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Down payment (from savings)</Label>
          <Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Monthly payment</Label>
          <Input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(Number(e.target.value))} />
        </div>
      </div>

      <Card className={result.affordable ? "border-primary/40" : "border-destructive/40"}>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {result.affordable ? (
              <CheckCircle2 className="size-6 text-primary" />
            ) : (
              <XCircle className="size-6 text-destructive" />
            )}
            <p className="font-medium">{result.affordable ? "Looks affordable" : "Would stretch your finances"}</p>
          </div>
          <p className="text-sm text-muted-foreground">{result.verdictSummary}</p>
          <div className="rounded-lg bg-secondary/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Savings rate after purchase</span>
              <span className="font-medium tabular-nums">{formatPercent(result.newSavingsRate)}</span>
            </div>
          </div>
          {result.monthsDelayedPerGoal.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Goal impact</p>
              {result.monthsDelayedPerGoal.map((g) => (
                <div key={g.goalId} className="flex justify-between text-sm">
                  <span>{g.goalTitle}</span>
                  <span className="text-destructive">+{g.monthsDelayed} mo</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
