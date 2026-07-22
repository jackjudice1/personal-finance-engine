import type { Liability } from "@/types/financial";

export type WhatIfPreset = "tax_refund" | "biweekly" | "plus_ten_percent" | "refinance";

/** A representative average tax refund - a labeled assumption, not pulled from any real data. */
const TAX_REFUND_AMOUNT = 2000;
const REFINANCE_RATE_REDUCTION = 8;
const REFINANCE_MIN_RATE = 3;

function highestAprDebt(debts: Liability[]): Liability | undefined {
  return [...debts].sort((a, b) => b.interestRate - a.interestRate)[0];
}

/**
 * Each preset is a parameter transform feeding the same projectDebtFreedom
 * engine - no new math subsystem. Lump-sum/refinance presets modify the
 * debts array (target the highest-APR debt, the realistic priority target
 * either way); biweekly/+10% presets scale the extra-payment pool.
 */
export function applyWhatIfPreset(
  debts: Liability[],
  extraMonthlyPayment: number,
  preset: WhatIfPreset | null
): { debts: Liability[]; extraMonthlyPayment: number } {
  if (!preset) return { debts, extraMonthlyPayment };

  const totalMinimums = debts.reduce((sum, d) => sum + d.minimumPayment, 0);

  switch (preset) {
    case "tax_refund": {
      const target = highestAprDebt(debts);
      if (!target) return { debts, extraMonthlyPayment };
      return {
        debts: debts.map((d) => (d.id === target.id ? { ...d, balance: Math.max(0, d.balance - TAX_REFUND_AMOUNT) } : d)),
        extraMonthlyPayment,
      };
    }
    case "biweekly":
      // Biweekly (26 half-payments/year) is equivalent to one extra full monthly-equivalent payment per year, spread evenly.
      return { debts, extraMonthlyPayment: extraMonthlyPayment + totalMinimums / 12 };
    case "plus_ten_percent":
      return { debts, extraMonthlyPayment: extraMonthlyPayment + (totalMinimums + extraMonthlyPayment) * 0.1 };
    case "refinance": {
      const target = highestAprDebt(debts);
      if (!target) return { debts, extraMonthlyPayment };
      const newRate = Math.max(REFINANCE_MIN_RATE, target.interestRate - REFINANCE_RATE_REDUCTION);
      return {
        debts: debts.map((d) => (d.id === target.id ? { ...d, interestRate: newRate } : d)),
        extraMonthlyPayment,
      };
    }
  }
}
