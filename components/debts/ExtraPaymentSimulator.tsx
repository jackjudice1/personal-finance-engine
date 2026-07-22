"use client";

import { SimulatorSliderPanel, type SliderConfig } from "@/components/simulators/SimulatorSliderPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

const QUICK_AMOUNTS = [25, 50, 100, 250, 500];

export function ExtraPaymentSimulator({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const slider: SliderConfig = {
    key: "extraMonthlyPayment",
    label: "Extra Monthly Payment",
    min: 0,
    max: 2000,
    step: 25,
    value,
    onChange,
    format: formatCurrency,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Extra Payment Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SimulatorSliderPanel sliders={[slider]} />
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <Button key={amount} type="button" variant="outline" size="sm" onClick={() => onChange(value + amount)}>
              +{formatCurrency(amount)}
            </Button>
          ))}
          {value > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(0)}>
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
