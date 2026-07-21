import type { FinancialProfile } from "@/types/financial";
import type { DecisionAnalysis, CoachRiskLevel } from "@/types/coach";
import { canIAffordThis } from "@/lib/simulators/canIAffordThis";
import { calculateHealthScore } from "@/lib/engine/healthScore";
import { ASSUMED_ANNUAL_INVESTMENT_RETURN } from "@/lib/simulators/whatIf";
import { formatCurrency, formatPercent } from "@/utils/formatters";

export type PurchaseType = "car" | "house" | "other";

export interface DecisionAnalysisInput {
  purchaseLabel: string;
  purchaseType: PurchaseType;
  purchasePrice: number;
  monthlyPayment: number;
  downPayment: number;
}

/** Years the opportunity-cost projection compounds over - matches the horizon used elsewhere for illustrative long-run comparisons. */
const OPPORTUNITY_COST_HORIZON_YEARS = 10;

/** Returns a shallow-cloned profile with an added recurring monthly expense, keeping savingsRate consistent for a "what would my score be after this" comparison. */
function withAddedMonthlyExpense(profile: FinancialProfile, amount: number): FinancialProfile {
  const monthlyExpenses = profile.monthlyExpenses + amount;
  const savingsRate = profile.monthlyIncome > 0 ? (profile.monthlyIncome - monthlyExpenses) / profile.monthlyIncome : 0;
  return { ...profile, monthlyExpenses, savingsRate };
}

/** Future value of investing `monthlyAmount` every month for `years` at ASSUMED_ANNUAL_INVESTMENT_RETURN, instead of spending it. */
function futureValueOfMonthlyAmount(monthlyAmount: number, years: number): number {
  const monthlyRate = ASSUMED_ANNUAL_INVESTMENT_RETURN / 12;
  const months = years * 12;
  return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function estimateMonthlyInsurance(purchaseType: PurchaseType, purchasePrice: number): number | null {
  if (purchaseType === "car") return Math.round((purchasePrice * 0.03) / 12);
  if (purchaseType === "house") return Math.round((purchasePrice * 0.0035) / 12);
  return null;
}

export function buildDecisionAnalysis(input: DecisionAnalysisInput, profile: FinancialProfile): DecisionAnalysis {
  const { purchaseLabel, purchaseType, purchasePrice, monthlyPayment, downPayment } = input;

  const affordability = canIAffordThis({ purchasePrice, monthlyPayment, downPayment }, profile);
  const healthBefore = calculateHealthScore(profile);
  const healthAfter = calculateHealthScore(withAddedMonthlyExpense(profile, monthlyPayment));

  const opportunityCost = futureValueOfMonthlyAmount(monthlyPayment, OPPORTUNITY_COST_HORIZON_YEARS);
  const insuranceEstimate = estimateMonthlyInsurance(purchaseType, purchasePrice);

  let riskLevel: CoachRiskLevel = "low";
  if (!affordability.affordable) riskLevel = "high";
  else if (affordability.newSavingsRate < 0.1) riskLevel = "medium";

  const pros: string[] = [];
  const cons: string[] = [];

  if (affordability.affordable) {
    pros.push(`Keeps your savings rate at ${formatPercent(affordability.newSavingsRate)} afterward.`);
  } else {
    cons.push(`Drops your savings rate to ${formatPercent(affordability.newSavingsRate)}, below a comfortable 5% buffer.`);
  }
  if (downPayment > 0 && downPayment <= profile.emergencyFundBalance) {
    cons.push(`The ${formatCurrency(downPayment)} down payment could eat into your emergency fund if that's where it comes from.`);
  }
  const worstDelay = [...affordability.monthsDelayedPerGoal].sort((a, b) => b.monthsDelayed - a.monthsDelayed)[0];
  if (worstDelay && worstDelay.monthsDelayed >= 999) {
    cons.push(`Would stall funding for "${worstDelay.goalTitle}" entirely at this payment level.`);
  } else if (worstDelay) {
    cons.push(`Would delay "${worstDelay.goalTitle}" by about ${worstDelay.monthsDelayed} months.`);
  } else if (profile.goals.length > 0) {
    pros.push("Doesn't push back any of your active goals.");
  }
  if (healthAfter.overall >= healthBefore.overall - 2) {
    pros.push("Minimal impact on your overall Financial Health Score.");
  } else {
    cons.push(`Financial Health Score drops from ${healthBefore.overall} to ${healthAfter.overall}.`);
  }
  pros.push(`Investing ${formatCurrency(monthlyPayment)}/mo instead would grow to roughly ${formatCurrency(
    opportunityCost
  )} in ${OPPORTUNITY_COST_HORIZON_YEARS} years — the trade-off either way you choose.`);

  const assumptions = [
    `Opportunity cost assumes a ${formatPercent(ASSUMED_ANNUAL_INVESTMENT_RETURN)} average annual investment return, compounded monthly.`,
  ];
  if (insuranceEstimate !== null) {
    assumptions.push(
      `Insurance estimate is a rough ${purchaseType === "car" ? "3% of purchase price/year" : "0.35% of purchase price/year"} heuristic, not a quote.`
    );
  }
  assumptions.push("Fuel savings aren't estimated — that requires knowing your current vehicle's cost to compare against, which isn't tracked yet.");

  return {
    purchaseLabel,
    pros,
    cons,
    monthlyPaymentEstimate: monthlyPayment,
    insuranceEstimate,
    fuelSavings: null,
    opportunityCost: Math.round(opportunityCost),
    retirementImpact:
      "This purchase doesn't touch your retirement or investment accounts directly — the impact is indirect, through less monthly cash flow available to contribute going forward.",
    emergencyFundImpact:
      downPayment > 0
        ? `Your ${formatCurrency(profile.emergencyFundBalance)} emergency fund ${
            downPayment <= profile.emergencyFundBalance
              ? "could cover the down payment, but doing so would leave it depleted until rebuilt."
              : "isn't enough to cover the down payment on its own."
          }`
        : "No down payment means your emergency fund isn't directly affected.",
    healthScoreBefore: healthBefore.overall,
    healthScoreAfter: healthAfter.overall,
    riskLevel,
    recommendation: affordability.verdictSummary,
    assumptions,
  };
}
