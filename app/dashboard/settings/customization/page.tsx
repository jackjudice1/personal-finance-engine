"use client";

import { useTheme } from "next-themes";
import { Check } from "lucide-react";
import { usePersonalityMode } from "@/components/dashboard/PersonalityModeProvider";
import { PERSONALITY_MODES } from "@/lib/constants/personalityModes";
import { WidgetToggleGrid } from "@/components/dashboard/WidgetToggleGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FinancialPersonality } from "@/types/database.types";

export default function CustomizationPage() {
  const { mode, setMode } = usePersonalityMode();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Customization</h1>
        <p className="text-sm text-muted-foreground">Make the dashboard feel like yours.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experience style</CardTitle>
          <CardDescription>Changes the tone of recommendations and the assistant.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(PERSONALITY_MODES) as FinancialPersonality[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={cn(
                "relative rounded-xl border p-4 text-left transition-colors",
                mode === key ? "border-primary bg-accent/40" : "border-border/60 hover:border-primary/40"
              )}
            >
              {mode === key && <Check className="absolute top-3 right-3 size-4 text-primary" />}
              <p className="font-medium">{PERSONALITY_MODES[key].label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{PERSONALITY_MODES[key].description}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-sm capitalize transition-colors",
                theme === t ? "border-primary bg-accent/40 font-medium" : "border-border/60 hover:border-primary/40"
              )}
            >
              {t}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard widgets</CardTitle>
          <CardDescription>Choose what shows on your main dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <WidgetToggleGrid />
        </CardContent>
      </Card>
    </div>
  );
}
