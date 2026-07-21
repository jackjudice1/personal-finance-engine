"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export interface SliderConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}

export function SimulatorSliderPanel({ sliders }: { sliders: SliderConfig[] }) {
  return (
    <div className="space-y-5">
      {sliders.map((slider) => (
        <div key={slider.key} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <Label>{slider.label}</Label>
            <span className="font-medium tabular-nums">{slider.format(slider.value)}</span>
          </div>
          <Slider
            value={[slider.value]}
            min={slider.min}
            max={slider.max}
            step={slider.step}
            onValueChange={(value) => slider.onChange(Array.isArray(value) ? value[0] : value)}
          />
        </div>
      ))}
    </div>
  );
}
