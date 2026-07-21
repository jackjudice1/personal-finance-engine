"use client";

import { useWidgetPreferences, type WidgetPreferences } from "@/hooks/useWidgetPreferences";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const WIDGET_LABELS: Record<keyof WidgetPreferences, string> = {
  healthScore: "Financial Health Score",
  netWorth: "Net Worth chart",
  snapshot: "Money snapshot cards",
  recommendations: "Recommendations feed",
};

export function WidgetToggleGrid() {
  const { preferences, setPreference } = useWidgetPreferences();

  return (
    <div className="space-y-3">
      {(Object.keys(WIDGET_LABELS) as (keyof WidgetPreferences)[]).map((key) => (
        <div key={key} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
          <Label htmlFor={key} className="text-sm font-normal">
            {WIDGET_LABELS[key]}
          </Label>
          <Switch id={key} checked={preferences[key]} onCheckedChange={(checked) => setPreference(key, Boolean(checked))} />
        </div>
      ))}
    </div>
  );
}
