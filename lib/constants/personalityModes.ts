import type { FinancialPersonality } from "@/types/database.types";

export interface PersonalityModeCopy {
  label: string;
  description: string;
  /** Prefix applied before a recommendation description to set the tone. */
  encouragement: string[];
  /** How much detail/density the dashboard should show. */
  density: "high" | "medium" | "low";
}

export const PERSONALITY_MODES: Record<FinancialPersonality, PersonalityModeCopy> = {
  coach: {
    label: "Coach",
    description: "Encouraging and motivational — celebrates progress, frames setbacks as next steps.",
    encouragement: [
      "Nice work so far — here's your next move:",
      "You're building real momentum. Next up:",
      "Keep this pace and you'll get there. Right now:",
    ],
    density: "medium",
  },
  analyst: {
    label: "Analyst",
    description: "Data-heavy — every number, every breakdown, minimal hand-holding.",
    encouragement: [],
    density: "high",
  },
  minimal: {
    label: "Minimal",
    description: "Simple and clean — just the single most important thing to do next.",
    encouragement: [],
    density: "low",
  },
};
