"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { AssetsStepInput, DebtStepInput, ExpensesStepInput, GoalsStepInput, IncomeStepInput } from "@/lib/validations/onboarding";

export interface OnboardingDraft {
  income: IncomeStepInput | null;
  expenses: ExpensesStepInput | null;
  debt: DebtStepInput | null;
  assets: AssetsStepInput | null;
  goals: GoalsStepInput | null;
}

interface OnboardingContextValue {
  draft: OnboardingDraft;
  setIncome: (value: IncomeStepInput) => void;
  setExpenses: (value: ExpensesStepInput) => void;
  setDebt: (value: DebtStepInput) => void;
  setAssets: (value: AssetsStepInput) => void;
  setGoals: (value: GoalsStepInput) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const EMPTY_DRAFT: OnboardingDraft = { income: null, expenses: null, debt: null, assets: null, goals: null };

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_DRAFT);

  const value: OnboardingContextValue = {
    draft,
    setIncome: (income) => setDraft((d) => ({ ...d, income })),
    setExpenses: (expenses) => setDraft((d) => ({ ...d, expenses })),
    setDebt: (debt) => setDraft((d) => ({ ...d, debt })),
    setAssets: (assets) => setDraft((d) => ({ ...d, assets })),
    setGoals: (goals) => setDraft((d) => ({ ...d, goals })),
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
