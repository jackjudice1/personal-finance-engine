import type { Liability } from "@/types/financial";
import type { BalanceOverTimePoint, DebtFreedomSummary, DebtProjection, PayoffStrategy, TimeRemaining } from "@/types/debt";

/** Safety cap so a debt whose payment never covers interest can't loop forever. */
const MAX_MONTHS = 600;

function addMonths(base: Date, months: number): string {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

/** Priority order debts are attacked in - fixed at the start of the projection, not re-sorted as balances change. */
function orderedDebtIds(debts: Liability[], strategy: PayoffStrategy, customOrder?: string[]): string[] {
  if (strategy === "custom" && customOrder?.length) return customOrder;
  const sorted = [...debts];
  if (strategy === "snowball") {
    sorted.sort((a, b) => a.balance - b.balance);
  } else {
    sorted.sort((a, b) => b.interestRate - a.interestRate);
  }
  return sorted.map((d) => d.id);
}

function emptySummary(): DebtFreedomSummary {
  const today = new Date().toISOString();
  return {
    debtFreeDate: today,
    totalMonthsRemaining: 0,
    totalBalanceRemaining: 0,
    totalInterestRemaining: 0,
    totalMonthlyPayments: 0,
    overallProgressPercent: 100,
    totalEliminated: 0,
    perDebt: [],
    balanceOverTime: [{ month: 0, totalBalance: 0 }],
  };
}

/**
 * Simulates month-by-month payoff across every debt at once: interest
 * accrues and the minimum payment applies to every still-active debt each
 * month, then the extra-payment pool (the slider amount, plus every
 * already-paid-off debt's freed-up minimum payment rolled forward) is
 * applied to the highest-priority still-active debt, cascading to the next
 * one in the same month if it fully pays that debt off. This is the
 * standard avalanche/snowball "rolling" method - not a simple per-debt
 * amortization, which is why this is a new module rather than reusing
 * lib/simulators/debtVsInvesting.ts's single-debt helpers.
 */
export function projectDebtFreedom(
  debts: Liability[],
  strategy: PayoffStrategy,
  extraMonthlyPayment: number,
  customOrder?: string[]
): DebtFreedomSummary {
  if (debts.length === 0) return emptySummary();

  const order = orderedDebtIds(debts, strategy, customOrder);
  const balances = new Map(debts.map((d) => [d.id, d.balance]));
  const monthlyRates = new Map(debts.map((d) => [d.id, d.interestRate / 100 / 12]));
  const minimums = new Map(debts.map((d) => [d.id, d.minimumPayment]));
  const interestRemaining = new Map(debts.map((d) => [d.id, 0]));
  // Debts that start already at zero balance are "paid off" from month 0, not "never pays off" (null) -
  // null is reserved for debts still active when the simulation hits MAX_MONTHS without reaching zero.
  const payoffMonth = new Map<string, number | null>(debts.map((d) => [d.id, d.balance <= 0 ? 0 : null]));
  const startingTotalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const balanceOverTime: BalanceOverTimePoint[] = [{ month: 0, totalBalance: startingTotalBalance }];

  let month = 0;
  while ([...balances.values()].some((b) => b > 0) && month < MAX_MONTHS) {
    month++;

    const paidOffMinimums = debts.reduce((sum, d) => (balances.get(d.id)! <= 0 ? sum + minimums.get(d.id)! : sum), 0);
    let pool = extraMonthlyPayment + paidOffMinimums;

    for (const debt of debts) {
      const bal = balances.get(debt.id)!;
      if (bal <= 0) continue;
      const interest = bal * monthlyRates.get(debt.id)!;
      interestRemaining.set(debt.id, interestRemaining.get(debt.id)! + interest);
      balances.set(debt.id, bal + interest - minimums.get(debt.id)!);
    }

    for (const debt of debts) {
      const bal = balances.get(debt.id)!;
      if (bal < 0) {
        pool += -bal;
        balances.set(debt.id, 0);
        if (payoffMonth.get(debt.id) === null) payoffMonth.set(debt.id, month);
      }
    }

    for (const id of order) {
      if (pool <= 0) break;
      const bal = balances.get(id)!;
      if (bal <= 0) continue;
      if (pool >= bal) {
        pool -= bal;
        balances.set(id, 0);
        if (payoffMonth.get(id) === null) payoffMonth.set(id, month);
      } else {
        balances.set(id, bal - pool);
        pool = 0;
      }
    }

    balanceOverTime.push({ month, totalBalance: [...balances.values()].reduce((sum, b) => sum + b, 0) });
  }

  const anyUnpaid = [...balances.values()].some((b) => b > 0);
  const today = new Date();

  const perDebt: DebtProjection[] = debts.map((debt) => {
    const months = payoffMonth.get(debt.id) ?? null;
    return {
      debtId: debt.id,
      payoffDate: months !== null ? addMonths(today, months) : null,
      monthsRemaining: months,
      interestRemaining: Math.round(interestRemaining.get(debt.id)! * 100) / 100,
      interestPaidToDate: 0,
    };
  });

  const totalBalanceRemaining = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalOriginal = debts.reduce((sum, d) => sum + d.originalBalance, 0);
  const totalEliminated = Math.max(0, totalOriginal - totalBalanceRemaining);

  return {
    debtFreeDate: anyUnpaid ? null : addMonths(today, month),
    totalMonthsRemaining: anyUnpaid ? null : month,
    totalBalanceRemaining,
    totalInterestRemaining: Math.round(perDebt.reduce((sum, p) => sum + p.interestRemaining, 0) * 100) / 100,
    totalMonthlyPayments: debts.reduce((sum, d) => sum + d.minimumPayment, 0) + extraMonthlyPayment,
    overallProgressPercent: totalOriginal > 0 ? Math.min(100, Math.max(0, (totalEliminated / totalOriginal) * 100)) : 100,
    totalEliminated,
    perDebt,
    balanceOverTime,
  };
}

/** Calendar breakdown of the time between now and a target date - years/months/days, not a raw day count. */
export function getTimeRemaining(target: Date, from: Date = new Date()): TimeRemaining {
  let years = target.getFullYear() - from.getFullYear();
  let months = target.getMonth() - from.getMonth();
  let days = target.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}
