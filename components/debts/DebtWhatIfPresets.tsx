import { Banknote, Percent, RefreshCcw, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WhatIfPreset } from "@/lib/simulators/debtWhatIf";

const PRESETS: { id: WhatIfPreset; label: string; icon: typeof Banknote }[] = [
  { id: "tax_refund", label: "Pay an extra tax refund", icon: Banknote },
  { id: "biweekly", label: "Pay biweekly instead of monthly", icon: Repeat },
  { id: "plus_ten_percent", label: "Increase payment by 10%", icon: Percent },
  { id: "refinance", label: "Lower interest through refinancing", icon: RefreshCcw },
];

export function DebtWhatIfPresets({
  active,
  onSelect,
}: {
  active: WhatIfPreset | null;
  onSelect: (preset: WhatIfPreset | null) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">What If?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const isActive = active === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(isActive ? null : preset.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              <preset.icon className="size-3.5" />
              {preset.label}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
