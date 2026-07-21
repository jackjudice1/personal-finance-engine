import type { FinancialProfile } from "@/types/financial";
import type { WhatIfInput, WhatIfProjectionPoint, WhatIfResult } from "@/types/engine";

/** Assumed long-run nominal annual return for invested assets in projections. */
export const ASSUMED_ANNUAL_INVESTMENT_RETURN = 0.07;

function project(
  profile: FinancialProfile,
  monthlyCashDelta: number,
  monthlyInvestmentContribution: number,
  monthlyDebtPayment: number,
  years: number
): WhatIfProjectionPoint[] {
  const points: WhatIfProjectionPoint[] = [];
  let cashAssets = profile.totalAssets - profile.totalInvestmentAssets;
  let investmentAssets = profile.totalInvestmentAssets;
  let liabilities = profile.totalLiabilities;
  const monthlyReturn = ASSUMED_ANNUAL_INVESTMENT_RETURN / 12;

  for (let year = 0; year <= years; year++) {
    if (year > 0) {
      for (let m = 0; m < 12; m++) {
        investmentAssets = investmentAssets * (1 + monthlyReturn) + monthlyInvestmentContribution;
        liabilities = Math.max(0, liabilities - monthlyDebtPayment);
        cashAssets = Math.max(0, cashAssets + monthlyCashDelta);
      }
    }
    const totalAssets = cashAssets + investmentAssets;
    points.push({
      year,
      totalAssets: Math.round(totalAssets),
      totalLiabilities: Math.round(liabilities),
      netWorth: Math.round(totalAssets - liabilities),
    });
  }

  return points;
}

/**
 * Projects net worth forward under adjusted assumptions. Income/expense
 * deltas accumulate as cash (not invested) so they're independent levers
 * from the explicit investment/debt-payment sliders. Investable assets
 * compound at ASSUMED_ANNUAL_INVESTMENT_RETURN - a simplification
 * appropriate for a planning tool, not a literal forecast.
 */
export function whatIf(input: WhatIfInput, profile: FinancialProfile): WhatIfResult {
  const baseline = project(profile, 0, 0, 0, input.horizonYears);
  const monthlyCashDelta = input.monthlyIncomeDelta - input.monthlyExpensesDelta;
  const projection = project(
    profile,
    monthlyCashDelta,
    input.extraMonthlyInvestment,
    input.extraMonthlyDebtPayment,
    input.horizonYears
  );

  return {
    projection,
    endingNetWorth: projection[projection.length - 1].netWorth,
    baselineEndingNetWorth: baseline[baseline.length - 1].netWorth,
  };
}
