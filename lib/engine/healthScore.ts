import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown, HealthScoreSubDetail } from "@/types/engine";
import { formatCurrency, formatPercent } from "@/utils/formatters";

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
/** Debt-to-income ratio shown to users as the "healthy" benchmark - a stricter, more legible number than the 33%+ point where the score formula bottoms out. */
const DEBT_HEALTHY_BENCHMARK_RATIO = 0.1;
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

  const cashFlowDetail: HealthScoreSubDetail = {
    score: Math.round(cashFlow),
    currentValue: savingsRate,
    targetValue: CASH_FLOW_TARGET_SAVINGS_RATE,
    format: "percent",
    why: `You're saving ${formatPercent(savingsRate)} of your income${
      savingsRate >= CASH_FLOW_TARGET_SAVINGS_RATE ? ", above the 20% target." : " - the target is 20%."
    }`,
    action:
      cashFlow >= 100
        ? null
        : { label: "See how changes affect this", href: "/dashboard/simulators/what-if" },
  };

  const debtDetail: HealthScoreSubDetail = {
    score: Math.round(debt),
    currentValue: debtToIncomeRatio,
    targetValue: DEBT_HEALTHY_BENCHMARK_RATIO,
    format: "percent",
    why: `${formatPercent(debtToIncomeRatio)} of your income goes to minimum debt payments${
      debtToIncomeRatio <= DEBT_HEALTHY_BENCHMARK_RATIO ? ", a healthy level." : " - under 10% is a healthy target."
    }`,
    // Gated on the healthy benchmark, not a literal score of 100 - that's
    // only reachable with zero minimum payments, which is an unrealistic
    // bar for "nothing to fix here."
    action:
      debtToIncomeRatio <= DEBT_HEALTHY_BENCHMARK_RATIO
        ? null
        : { label: "See debt payoff recommendations", href: "/dashboard/recommendations" },
  };

  const savingsDetail: HealthScoreSubDetail = {
    score: Math.round(savings),
    currentValue: emergencyFundBalance,
    targetValue: emergencyFundTarget,
    format: "currency",
    why:
      emergencyFundTarget > 0
        ? `${formatCurrency(emergencyFundBalance)} of a ${formatCurrency(emergencyFundTarget)} target (${EMERGENCY_FUND_TARGET_MONTHS} months of expenses).`
        : "Add your expenses to see your emergency fund target.",
    action: savings >= 100 ? null : { label: "Add or grow your emergency fund", href: "/dashboard/settings/financial-profile" },
  };

  const investmentDetail: HealthScoreSubDetail = {
    score: Math.round(investment),
    currentValue: totalInvestmentAssets,
    targetValue: investmentTarget,
    format: "currency",
    why:
      investmentTarget > 0
        ? `${formatCurrency(totalInvestmentAssets)} invested, of a ${formatCurrency(investmentTarget)} target (half a year's income).`
        : "Add your income to see your investment target.",
    action: investment >= 100 ? null : { label: "Add your investment accounts", href: "/dashboard/settings/financial-profile" },
  };

  return {
    overall,
    cashFlow: Math.round(cashFlow),
    debt: Math.round(debt),
    savings: Math.round(savings),
    investment: Math.round(investment),
    details: {
      cashFlow: cashFlowDetail,
      debt: debtDetail,
      savings: savingsDetail,
      investment: investmentDetail,
    },
  };
}
