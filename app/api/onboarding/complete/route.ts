import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  assetsStepSchema,
  debtStepSchema,
  expensesStepSchema,
  goalsStepSchema,
  incomeStepSchema,
} from "@/lib/validations/onboarding";
import { z } from "zod";

const bodySchema = z.object({
  income: incomeStepSchema,
  expenses: expensesStepSchema,
  debt: debtStepSchema,
  assets: assetsStepSchema,
  goals: goalsStepSchema,
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid onboarding data", issues: parsed.error.issues }, { status: 400 });
  }

  const { income, expenses, debt, assets, goals } = parsed.data;

  const incomeRows = income.incomeSources.map((s) => ({
    user_id: user.id,
    label: s.label,
    amount: s.amount,
    frequency: s.frequency,
    is_primary: s.isPrimary,
    deduction_rate: s.deductionRate,
  }));

  const expenseRows = Object.entries(expenses.expenses)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      user_id: user.id,
      category: category as keyof typeof expenses.expenses,
      amount,
    }));

  const liabilityRows = debt.liabilities.map((l) => ({
    user_id: user.id,
    type: l.type,
    label: l.label,
    balance: l.balance,
    original_balance: l.balance,
    interest_rate: l.interestRate,
    minimum_payment: l.minimumPayment,
  }));

  const assetRows = assets.assets.map((a) => ({
    user_id: user.id,
    type: a.type,
    label: a.label,
    balance: a.balance,
    is_emergency_fund: a.isEmergencyFund,
  }));

  const goalRows = goals.goals.map((g) => ({
    user_id: user.id,
    type: g.type,
    title: g.title,
    target_amount: g.targetAmount,
    target_date: g.targetDate ? g.targetDate.slice(0, 10) : null,
    monthly_contribution: g.monthlyContribution,
  }));

  const inserts = await Promise.all([
    incomeRows.length ? supabase.from("income_sources").insert(incomeRows) : null,
    expenseRows.length ? supabase.from("expenses").insert(expenseRows) : null,
    liabilityRows.length ? supabase.from("liabilities").insert(liabilityRows) : null,
    assetRows.length ? supabase.from("assets").insert(assetRows) : null,
    goalRows.length ? supabase.from("goals").insert(goalRows) : null,
  ]);

  const failed = inserts.find((result) => result?.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true, onboarding_step: "complete" })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
