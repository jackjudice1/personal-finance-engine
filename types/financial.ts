import type {
  AssetType,
  ExpenseCategory,
  GoalStatus,
  GoalType,
  IncomeFrequency,
  LiabilityType,
} from "@/types/database.types";

export interface IncomeSource {
  id: string;
  label: string;
  amount: number;
  frequency: IncomeFrequency;
  isPrimary: boolean;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  label: string | null;
  amount: number;
}

export interface Asset {
  id: string;
  type: AssetType;
  label: string;
  balance: number;
  interestRate: number | null;
  isEmergencyFund: boolean;
}

export interface Liability {
  id: string;
  type: LiabilityType;
  label: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  monthlyContribution: number;
  priority: number;
  status: GoalStatus;
}

export interface StockHolding {
  id: string;
  ticker: string;
  companyName: string | null;
  shares: number;
  costBasisPerShare: number;
  lastPrice: number | null;
  lastPriceFetchedAt: string | null;
}

/**
 * The aggregated shape every rule in lib/engine and lib/simulators consumes.
 * Built once per request from the raw Supabase rows (see
 * hooks/useFinancialProfile.ts / lib/engine/netWorth.ts helpers) so all
 * downstream logic works with normalized monthly numbers.
 */
export interface FinancialProfile {
  userId: string;
  incomeSources: IncomeSource[];
  monthlyIncome: number;
  expenses: Expense[];
  monthlyExpenses: number;
  expensesByCategory: Record<ExpenseCategory, number>;
  assets: Asset[];
  totalAssets: number;
  totalInvestmentAssets: number;
  emergencyFundBalance: number;
  liabilities: Liability[];
  totalLiabilities: number;
  totalMinimumPayments: number;
  goals: Goal[];
  stockHoldings: StockHolding[];
  totalStockHoldingsCostBasis: number;
  totalStockHoldingsValue: number;
  savingsRate: number; // (income - expenses) / income, 0-1
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  housing: "Housing",
  transportation: "Transportation",
  food: "Food",
  subscriptions: "Subscriptions",
  insurance: "Insurance",
  healthcare: "Healthcare",
  entertainment: "Entertainment",
  other: "Other",
};

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  savings: "Savings",
  checking: "Checking",
  investment: "Investments",
  retirement: "Retirement",
  real_estate: "Real Estate",
  other: "Other",
};

export const LIABILITY_TYPE_LABELS: Record<LiabilityType, string> = {
  credit_card: "Credit Card",
  student_loan: "Student Loan",
  auto_loan: "Auto Loan",
  mortgage: "Mortgage",
  personal_loan: "Personal Loan",
  other: "Other",
};

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  debt_freedom: "Debt Freedom",
  emergency_fund: "Emergency Fund",
  home_purchase: "Buy a Home",
  car_purchase: "Buy a Car",
  vacation: "Vacation",
  retirement: "Retirement",
  invest_more: "Invest More",
  business: "Start a Business",
  custom: "Custom Goal",
};

/** Normalizes any income frequency to a monthly amount. */
export function toMonthlyAmount(amount: number, frequency: IncomeFrequency): number {
  switch (frequency) {
    case "weekly":
      return (amount * 52) / 12;
    case "biweekly":
      return (amount * 26) / 12;
    case "monthly":
      return amount;
    case "annually":
      return amount / 12;
  }
}
