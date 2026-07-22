export type PayoffStrategy = "avalanche" | "snowball" | "custom";

export interface DebtProjection {
  debtId: string;
  /** ISO date string, or null if this debt never pays off at the simulated payment level (interest outpaces payments). */
  payoffDate: string | null;
  monthsRemaining: number | null;
  interestRemaining: number;
  /** Approximated from payment history at the debt's current interest rate - not exact accounting. */
  interestPaidToDate: number;
}

export interface DebtFreedomSummary {
  debtFreeDate: string | null;
  totalMonthsRemaining: number | null;
  totalBalanceRemaining: number;
  totalInterestRemaining: number;
  totalMonthlyPayments: number;
  overallProgressPercent: number;
  totalEliminated: number;
  perDebt: DebtProjection[];
}

export interface TimeRemaining {
  years: number;
  months: number;
  days: number;
}
