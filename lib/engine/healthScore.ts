import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown } from "@/types/engine";

/**
 * Tunable thresholds for the health score formula. Kept as named constants
 * so scoring behavior can be adjusted without touching the calculation
 * logic itself.
 */
export const HEALTH_SCORE_WEIGHTS = {
  cashFlow: 0.25,
  debt: 0.25,
  savings: 0.25,
  investment: 0.25,
} as const;

/** Savings rate at which the cash flow sub-score hits 100. */
const CASH_FLOW_TARGET_SAVINGS_RATE = 0.2;
/** Multiplier applied to debt-to-income ratio before penalizing the debt score. */
const DEBT_SCORE_PENALTY_MULTIPLIER = 300;
/** Months of expenses a fully-funded emergency fund should cover. */
const EMERGENCY_FUND_TARGET_MONTHS = 3;
/** Fraction of annual income invested that scores a perfect investment sub-score. */
const INVESTMENT_TARGET_INCOME_MULTIPLE = 0.5;

function clamp(value: number, min = 0, max = 100): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function calculateHealthScore(profile: FinancialProfile): HealthScoreBreakdown {
  const { monthlyIncome, monthlyExpenses, savingsRate, emergencyFundBalance, totalInvestmentAssets, totalMinimumPayments } =
    profile;

  const cashFlow = clamp((savingsRate / CASH_FLOW_TARGET_SAVINGS_RATE) * 100);

  const debtToIncomeRatio = monthlyIncome > 0 ? totalMinimumPayments / monthlyIncome : 1;
  const debt = 100 - clamp(debtToIncomeRatio * DEBT_SCORE_PENALTY_MULTIPLIER);

  const emergencyFundTarget = monthlyExpenses * EMERGENCY_FUND_TARGET_MONTHS;
  const savings = emergencyFundTarget > 0 ? clamp((emergencyFundBalance / emergencyFundTarget) * 100) : 0;

  const annualIncome = monthlyIncome * 12;
  const investmentTarget = annualIncome * INVESTMENT_TARGET_INCOME_MULTIPLE;
  const investment = investmentTarget > 0 ? clamp((totalInvestmentAssets / investmentTarget) * 100) : 0;

  const overall = Math.round(
    HEALTH_SCORE_WEIGHTS.cashFlow * cashFlow +
      HEALTH_SCORE_WEIGHTS.debt * debt +
      HEALTH_SCORE_WEIGHTS.savings * savings +
      HEALTH_SCORE_WEIGHTS.investment * investment
  );

  return {
    overall,
    cashFlow: Math.round(cashFlow),
    debt: Math.round(debt),
    savings: Math.round(savings),
    investment: Math.round(investment),
  };
}
