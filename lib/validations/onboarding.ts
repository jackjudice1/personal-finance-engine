import { z } from "zod";

export const incomeEntrySchema = z.object({
  label: z.string().min(1, "Give this income a name"),
  amount: z.number().min(0, "Enter an amount"),
  frequency: z.enum(["hourly", "daily", "weekly", "biweekly", "semi_monthly", "monthly", "annually"]),
  type: z.enum(["salary_wage", "commission", "tips_bonuses", "freelance", "passive_income", "other"]),
  isPrimary: z.boolean(),
  deductionRate: z.number().min(0, "Can't be negative").max(100, "Can't exceed 100%").nullable(),
});
export const incomeStepSchema = z.object({
  incomeSources: z.array(incomeEntrySchema).min(1, "Add at least one income source"),
});
export type IncomeStepInput = z.infer<typeof incomeStepSchema>;

export const EXPENSE_CATEGORIES = [
  "housing",
  "transportation",
  "food",
  "subscriptions",
  "insurance",
  "healthcare",
  "entertainment",
  "other",
] as const;

export const expensesStepSchema = z.object({
  expenses: z.record(z.enum(EXPENSE_CATEGORIES), z.number().min(0)),
});
export type ExpensesStepInput = z.infer<typeof expensesStepSchema>;

export const liabilityEntrySchema = z.object({
  type: z.enum(["credit_card", "student_loan", "auto_loan", "mortgage", "personal_loan", "other"]),
  label: z.string().min(1, "Name this debt"),
  balance: z.number().min(0),
  interestRate: z.number().min(0).max(100),
  minimumPayment: z.number().min(0),
});
export const debtStepSchema = z.object({
  liabilities: z.array(liabilityEntrySchema),
});
export type DebtStepInput = z.infer<typeof debtStepSchema>;

export const assetEntrySchema = z.object({
  type: z.enum(["savings", "checking", "investment", "retirement", "real_estate", "other"]),
  label: z.string().min(1, "Name this asset"),
  balance: z.number().min(0),
  isEmergencyFund: z.boolean(),
});
export const assetsStepSchema = z.object({
  assets: z.array(assetEntrySchema),
});
export type AssetsStepInput = z.infer<typeof assetsStepSchema>;

export const goalEntrySchema = z.object({
  type: z.enum([
    "debt_freedom",
    "emergency_fund",
    "home_purchase",
    "car_purchase",
    "vacation",
    "retirement",
    "invest_more",
    "business",
    "custom",
  ]),
  title: z.string().min(1),
  targetAmount: z.number().min(1, "Set a target amount"),
  targetDate: z.string().nullable(),
  monthlyContribution: z.number().min(0),
});
export const goalsStepSchema = z.object({
  goals: z.array(goalEntrySchema).min(1, "Pick at least one goal to start"),
});
export type GoalsStepInput = z.infer<typeof goalsStepSchema>;

export const ONBOARDING_STEPS = ["income", "expenses", "debt", "assets", "goals", "review"] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
