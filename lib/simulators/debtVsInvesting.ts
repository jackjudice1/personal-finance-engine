import type { DebtVsInvestingInput, DebtVsInvestingResult } from "@/types/engine";

/** Future value of a monthly-contribution annuity compounding at monthlyRate over `months`. */
function futureValueAnnuity(monthlyContribution: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return monthlyContribution * months;
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

/** Months to amortize `balance` at `monthlyRate` paying `payment`/month. Infinity if payment never covers interest. */
function monthsToPayOff(balance: number, monthlyRate: number, payment: number): number {
  if (payment <= 0) return Infinity;
  if (monthlyRate === 0) return balance / payment;
  const interestOnlyPayment = balance * monthlyRate;
  if (payment <= interestOnlyPayment) return Infinity;
  return Math.log(payment / (payment - interestOnlyPayment)) / Math.log(1 + monthlyRate);
}

/** Remaining balance after `months` of amortizing payments. */
function remainingBalanceAfter(balance: number, monthlyRate: number, payment: number, months: number): number {
  let remaining = balance;
  for (let i = 0; i < months && remaining > 0; i++) {
    remaining = remaining * (1 + monthlyRate) - payment;
  }
  return Math.max(0, remaining);
}

/**
 * Compares two simplified strategies over a horizon:
 *  - Pay debt first: extraMonthlyAmount goes entirely to extra debt payments
 *    until paid off, then the freed-up amount is invested for the remainder.
 *  - Invest first: extraMonthlyAmount is invested every month; the debt
 *    balance is assumed to stay flat (minimum payments cover interest) -
 *    a simplifying assumption appropriate for an illustrative comparison,
 *    not a literal amortization schedule.
 */
export function debtVsInvesting(input: DebtVsInvestingInput): DebtVsInvestingResult {
  const { extraMonthlyAmount, debtInterestRate, debtBalance, expectedInvestmentReturn, horizonYears } = input;
  const horizonMonths = horizonYears * 12;
  const debtMonthlyRate = debtInterestRate / 100 / 12;
  const investMonthlyRate = expectedInvestmentReturn / 100 / 12;

  const payoffMonths = monthsToPayOff(debtBalance, debtMonthlyRate, extraMonthlyAmount);

  let payDebtFirstNetWorth: number;
  if (payoffMonths >= horizonMonths) {
    const remainingDebt = remainingBalanceAfter(debtBalance, debtMonthlyRate, extraMonthlyAmount, horizonMonths);
    payDebtFirstNetWorth = -remainingDebt;
  } else {
    const remainingMonths = horizonMonths - Math.ceil(payoffMonths);
    payDebtFirstNetWorth = futureValueAnnuity(extraMonthlyAmount, investMonthlyRate, remainingMonths);
  }

  const investFirstGrowth = futureValueAnnuity(extraMonthlyAmount, investMonthlyRate, horizonMonths);
  const investFirstNetWorth = investFirstGrowth - debtBalance;

  const differenceAmount = investFirstNetWorth - payDebtFirstNetWorth;
  const threshold = Math.max(Math.abs(payDebtFirstNetWorth), Math.abs(investFirstNetWorth)) * 0.02;

  const recommendation: DebtVsInvestingResult["recommendation"] =
    Math.abs(differenceAmount) <= threshold ? "roughly_equal" : differenceAmount > 0 ? "invest_first" : "pay_debt_first";

  return {
    payDebtFirstNetWorth: Math.round(payDebtFirstNetWorth),
    investFirstNetWorth: Math.round(investFirstNetWorth),
    recommendation,
    differenceAmount: Math.round(Math.abs(differenceAmount)),
  };
}
