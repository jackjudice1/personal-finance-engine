import type { RecommendationCategory, RecommendationSeverity } from "@/types/database.types";

export interface Recommendation {
  ruleId: string;
  category: RecommendationCategory;
  severity: RecommendationSeverity;
  title: string;
  description: string;
  impactAmount?: number;
  relatedGoalId?: string;
}

export interface HealthScoreBreakdown {
  overall: number;
  cashFlow: number;
  debt: number;
  savings: number;
  investment: number;
}

export interface NetWorthSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export interface GoalProjection {
  goalId: string;
  monthlyContributionNeeded: number;
  projectedPayoffDate: string | null;
  onTrack: boolean;
  monthsRemaining: number | null;
}

export interface CanIAffordThisInput {
  purchasePrice: number;
  monthlyPayment: number;
  downPayment: number;
}

export interface CanIAffordThisResult {
  affordable: boolean;
  newSavingsRate: number;
  monthsDelayedPerGoal: { goalId: string; goalTitle: string; monthsDelayed: number }[];
  verdictSummary: string;
}

export interface DebtVsInvestingInput {
  extraMonthlyAmount: number;
  debtInterestRate: number;
  debtBalance: number;
  expectedInvestmentReturn: number;
  horizonYears: number;
}

export interface DebtVsInvestingResult {
  payDebtFirstNetWorth: number;
  investFirstNetWorth: number;
  recommendation: "pay_debt_first" | "invest_first" | "roughly_equal";
  differenceAmount: number;
}

export interface WhatIfInput {
  monthlyIncomeDelta: number;
  monthlyExpensesDelta: number;
  extraMonthlyInvestment: number;
  extraMonthlyDebtPayment: number;
  horizonYears: number;
}

export interface WhatIfProjectionPoint {
  year: number;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface WhatIfResult {
  projection: WhatIfProjectionPoint[];
  endingNetWorth: number;
  baselineEndingNetWorth: number;
}
