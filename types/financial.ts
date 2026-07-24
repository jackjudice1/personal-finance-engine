import type {
  AssetType,
  ExpenseCategory,
  GoalStatus,
  GoalType,
  IncomeFrequency,
  IncomeType,
  LiabilityType,
} from "@/types/database.types";

export interface IncomeSource {
  id: string;
  label: string;
  amount: number;
  frequency: IncomeFrequency;
  type: IncomeType;
  isPrimary: boolean;
  /** Estimated percentage (0-100) taken out for taxes/deductions - null means `amount` is already the net/take-home figure. */
  deductionRate: number | null;
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
  originalBalance: number;
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

export const INCOME_FREQUENCY_LABELS: Record<IncomeFrequency, string> = {
  hourly: "Hourly (40 hrs/week)",
  daily: "Daily (5 days/week)",
  weekly: "Weekly",
  biweekly: "Biweekly",
  semi_monthly: "Semi-monthly",
  monthly: "Monthly",
  annually: "Annually",
};

/** The unit shown in "≈ $X net per ___" previews - matches how the amount is entered, not always a calendar period. */
export const INCOME_FREQUENCY_NOUN: Record<IncomeFrequency, string> = {
  hourly: "hour",
  daily: "day",
  weekly: "week",
  biweekly: "paycheck",
  semi_monthly: "paycheck",
  monthly: "month",
  annually: "year",
};

export const INCOME_TYPE_LABELS: Record<IncomeType, string> = {
  salary_wage: "Salary/Wage",
  commission: "Commission",
  tips_bonuses: "Tips/Bonuses",
  freelance: "Freelance",
  passive_income: "Passive Income",
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

/** Applies an income source's estimated deduction rate, if set - otherwise returns the amount unchanged (already net). */
export function toNetAmount(amount: number, deductionRate: number | null): number {
  if (!deductionRate) return amount;
  return amount * (1 - deductionRate / 100);
}

/** Normalizes any income frequency to a monthly amount. */
export function toMonthlyAmount(amount: number, frequency: IncomeFrequency): number {
  switch (frequency) {
    case "hourly":
      // Assumes a standard 40-hour work week - disclosed directly in the frequency picker's label.
      return (amount * 40 * 52) / 12;
    case "daily":
      // Assumes a standard 5-day work week - disclosed directly in the frequency picker's label.
      return (amount * 5 * 52) / 12;
    case "weekly":
      return (amount * 52) / 12;
    case "biweekly":
      return (amount * 26) / 12;
    case "semi_monthly":
      // Paid twice a month (e.g. the 1st and 15th) - exactly 24 payments/year, unlike biweekly's 26.
      return amount * 2;
    case "monthly":
      return amount;
    case "annually":
      return amount / 12;
  }
}
