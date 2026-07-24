import type { FinancialPersonality } from "@/types/database.types";

export interface PersonalityModeCopy {
  label: string;
  description: string;
  /** How much detail/density the dashboard should show. */
  density: "high" | "medium" | "low";
}

export const PERSONALITY_MODES: Record<FinancialPersonality, PersonalityModeCopy> = {
  coach: {
    label: "Coach",
    description: "Encouraging and motivational — celebrates progress, frames setbacks as next steps.",
    density: "medium",
  },
  analyst: {
    label: "Analyst",
    description: "Data-heavy — every number, every breakdown, minimal hand-holding.",
    density: "high",
  },
  minimal: {
    label: "Minimal",
    description: "Simple and clean — just the single most important thing to do next.",
    density: "low",
  },
};
