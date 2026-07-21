export type CoachCategory =
  | "investment_advice"
  | "debt_payoff"
  | "retirement"
  | "budgeting"
  | "emergency_fund"
  | "taxes"
  | "credit_score"
  | "home_buying"
  | "car_buying"
  | "large_purchase"
  | "salary_negotiation"
  | "career_decisions"
  | "college_savings"
  | "insurance"
  | "cash_flow"
  | "general";

export interface CoachCategoryMeta {
  label: string;
  /** Tailwind classes applied to the Badge, following the app's existing `bg-x/15 text-x` semantic-color pattern. */
  className: string;
}

export const CATEGORY_META: Record<CoachCategory, CoachCategoryMeta> = {
  investment_advice: { label: "Investing", className: "bg-success/15 text-success" },
  debt_payoff: { label: "Debt Payoff", className: "bg-warning/15 text-warning" },
  retirement: { label: "Retirement", className: "bg-success/15 text-success" },
  budgeting: { label: "Budgeting", className: "bg-primary/15 text-primary" },
  emergency_fund: { label: "Emergency Fund", className: "bg-primary/15 text-primary" },
  taxes: { label: "Taxes", className: "bg-secondary text-secondary-foreground" },
  credit_score: { label: "Credit Score", className: "bg-warning/15 text-warning" },
  home_buying: { label: "Home Buying", className: "bg-premium/15 text-premium" },
  car_buying: { label: "Car Buying", className: "bg-premium/15 text-premium" },
  large_purchase: { label: "Large Purchase", className: "bg-premium/15 text-premium" },
  salary_negotiation: { label: "Salary Negotiation", className: "bg-primary/15 text-primary" },
  career_decisions: { label: "Career Decisions", className: "bg-primary/15 text-primary" },
  college_savings: { label: "College Savings", className: "bg-success/15 text-success" },
  insurance: { label: "Insurance", className: "bg-secondary text-secondary-foreground" },
  cash_flow: { label: "Cash Flow", className: "bg-primary/15 text-primary" },
  general: { label: "General", className: "bg-muted text-muted-foreground" },
};

export type CoachRiskLevel = "low" | "medium" | "high";

export interface DecisionAnalysis {
  purchaseLabel: string;
  pros: string[];
  cons: string[];
  monthlyPaymentEstimate: number;
  insuranceEstimate: number | null;
  fuelSavings: number | null;
  opportunityCost: number;
  retirementImpact: string;
  emergencyFundImpact: string;
  healthScoreBefore: number;
  healthScoreAfter: number;
  riskLevel: CoachRiskLevel;
  recommendation: string;
  assumptions: string[];
}

export type WhatIfScenarioType =
  | "salary_increase"
  | "lower_rent"
  | "invest_more"
  | "pay_off_debt"
  | "buy_a_house"
  | "buy_a_car"
  | "move_cities";

export interface WhatIfSliderDef {
  key: "monthlyIncomeDelta" | "monthlyExpensesDelta" | "extraMonthlyInvestment" | "extraMonthlyDebtPayment" | "horizonYears";
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  format: "currency" | "years";
}

export interface WhatIfScenarioConfig {
  type: WhatIfScenarioType;
  title: string;
  sliders: WhatIfSliderDef[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  category?: CoachCategory;
  decisionAnalysis?: DecisionAnalysis;
  whatIfScenario?: WhatIfScenarioConfig;
  followUps?: string[];
}
