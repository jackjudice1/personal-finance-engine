import type { UserLevel } from "@/types/database.types";
import type { LevelDefinition } from "@/types/gamification";

/** Ordered lowest to highest — index doubles as rank for comparisons. */
export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    level: "beginner",
    label: "Beginner",
    description: "Just getting started — your profile is set up and the engine is learning your numbers.",
    minHealthScore: 0,
  },
  {
    level: "saver",
    label: "Saver",
    description: "You've built real savings discipline and at least a month of runway.",
    minHealthScore: 40,
  },
  {
    level: "investor",
    label: "Investor",
    description: "Your money is working for you, not just sitting in cash.",
    minHealthScore: 60,
  },
  {
    level: "wealth_builder",
    label: "Wealth Builder",
    description: "Positive net worth and a strong overall score — you're compounding.",
    minHealthScore: 75,
  },
  {
    level: "financial_master",
    label: "Financial Master",
    description: "Elite financial health across cash flow, debt, savings, and investing.",
    minHealthScore: 90,
  },
];

export const LEVEL_RANK: Record<UserLevel, number> = {
  beginner: 0,
  saver: 1,
  investor: 2,
  wealth_builder: 3,
  financial_master: 4,
};
