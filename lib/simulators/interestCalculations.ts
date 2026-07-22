import type { DebtPaymentPoint } from "@/hooks/useDebtPaymentHistory";

/**
 * Approximates how much of the payments logged so far went to interest vs.
 * principal, using the debt's CURRENT interest rate for every past payment -
 * rate history isn't tracked, so this assumes the rate hasn't changed since.
 * An estimate for motivation/insight purposes, not exact accounting.
 */
export function estimateInterestPaidToDate(payments: DebtPaymentPoint[], currentInterestRate: number): number {
  const monthlyRate = currentInterestRate / 100 / 12;
  const totalInterest = payments.reduce((sum, payment) => {
    const balanceBefore = payment.balanceAfter + payment.amount;
    const interestPortion = Math.min(balanceBefore * monthlyRate, payment.amount);
    return sum + interestPortion;
  }, 0);
  return Math.round(totalInterest * 100) / 100;
}
