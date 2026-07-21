import type { FinancialProfile } from "@/types/financial";
import type { WhatIfScenarioConfig, WhatIfScenarioType, WhatIfSliderDef } from "@/types/coach";
import type { WhatIfInput, WhatIfResult } from "@/types/engine";
import { whatIf } from "@/lib/simulators/whatIf";
import { extractDollarAmount } from "@/lib/coach/extract";

/** Generous headroom above your current annual income so the slider can reach a meaningfully higher salary. */
const INCOME_HEADROOM = 300000;

const DEFAULT_HORIZON: WhatIfSliderDef = {
  key: "horizonYears",
  label: "Time horizon",
  min: 1,
  max: 40,
  step: 1,
  default: 15,
  format: "years",
};

const SCENARIO_CONFIG: Record<WhatIfScenarioType, (question: string, profile: FinancialProfile) => WhatIfScenarioConfig> = {
  salary_increase: (question, profile) => {
    const annualIncome = Math.round(profile.monthlyIncome * 12);
    const explicitRaise = extractDollarAmount(question);
    return {
      type: "salary_increase",
      title: "What if you got a raise?",
      sliders: [
        {
          key: "annualIncomeDelta",
          label: "Annual income",
          min: -annualIncome,
          max: INCOME_HEADROOM,
          step: 100,
          default: explicitRaise ?? 0,
          format: "currency",
          baseline: annualIncome,
        },
        DEFAULT_HORIZON,
      ],
    };
  },
  lower_rent: (_question, profile) => {
    const monthlyExpenses = Math.round(profile.monthlyExpenses);
    return {
      type: "lower_rent",
      title: "What if you lowered your rent?",
      sliders: [
        {
          key: "monthlyExpensesDelta",
          label: "Monthly expenses",
          min: -monthlyExpenses,
          max: 0,
          step: 100,
          default: -300,
          format: "currency",
          baseline: monthlyExpenses,
        },
        DEFAULT_HORIZON,
      ],
    };
  },
  invest_more: () => ({
    type: "invest_more",
    title: "What if you invested more?",
    sliders: [
      { key: "extraMonthlyInvestment", label: "Extra monthly investment", min: 0, max: 3000, step: 50, default: 300, format: "currency" },
      DEFAULT_HORIZON,
    ],
  }),
  pay_off_debt: () => ({
    type: "pay_off_debt",
    title: "What if you paid off debt faster?",
    sliders: [
      { key: "extraMonthlyDebtPayment", label: "Extra monthly debt payment", min: 0, max: 2000, step: 50, default: 200, format: "currency" },
      DEFAULT_HORIZON,
    ],
  }),
  buy_a_house: () => ({
    type: "buy_a_house",
    title: "What if you bought a house?",
    sliders: [
      { key: "monthlyExpensesDelta", label: "Monthly mortgage payment", min: 0, max: 5000, step: 100, default: 2000, format: "currency" },
      DEFAULT_HORIZON,
    ],
  }),
  buy_a_car: (question) => {
    const price = extractDollarAmount(question);
    return {
      type: "buy_a_car",
      title: "What if you bought a car?",
      sliders: [
        {
          key: "monthlyExpensesDelta",
          label: "Monthly car payment",
          min: 0,
          max: 1500,
          step: 25,
          default: price ? Math.round(price / 60) : 500,
          format: "currency",
        },
        DEFAULT_HORIZON,
      ],
    };
  },
  move_cities: () => ({
    type: "move_cities",
    title: "What if you moved cities?",
    sliders: [
      { key: "monthlyExpensesDelta", label: "Monthly cost-of-living change", min: -2000, max: 2000, step: 50, default: 0, format: "currency" },
      DEFAULT_HORIZON,
    ],
  }),
};

const SCENARIO_KEYWORDS: { type: WhatIfScenarioType; pattern: RegExp }[] = [
  { type: "buy_a_house", pattern: /\b(house|home|mortgage)\b/i },
  { type: "buy_a_car", pattern: /\b(car|vehicle|auto)\b/i },
  { type: "lower_rent", pattern: /\brent\b/i },
  { type: "pay_off_debt", pattern: /\b(pay off|debt)\b/i },
  { type: "invest_more", pattern: /\binvest/i },
  { type: "salary_increase", pattern: /\b(raise|salary|income|earn)\b/i },
  { type: "move_cities", pattern: /\bmov(e|ing)\b.*\bcit/i },
];

/** Matches "what if", "what happens if", "what would happen if", etc. - up to 3 words between "what" and "if". */
const WHAT_IF_PHRASING = /\bwhat\s+(?:\w+\s+){0,3}if\b/i;

/** Only triggers on explicit "what if"-style phrasing, paired with a recognized scenario keyword. */
export function detectWhatIfScenario(question: string, profile: FinancialProfile): WhatIfScenarioConfig | null {
  if (!WHAT_IF_PHRASING.test(question)) return null;

  for (const { type, pattern } of SCENARIO_KEYWORDS) {
    if (pattern.test(question)) return SCENARIO_CONFIG[type](question, profile);
  }
  return null;
}

/** Bridges the scenario's slider state to the existing whatIf() simulator. annualIncomeDelta (a synthetic, UI-only unit) is converted to the monthly delta whatIf() expects. */
export function runWhatIfScenario(
  config: WhatIfScenarioConfig,
  sliderValues: Record<string, number>,
  profile: FinancialProfile
): WhatIfResult {
  const annualIncomeDelta = sliderValues.annualIncomeDelta;
  const input: WhatIfInput = {
    monthlyIncomeDelta: annualIncomeDelta !== undefined ? annualIncomeDelta / 12 : sliderValues.monthlyIncomeDelta ?? 0,
    monthlyExpensesDelta: sliderValues.monthlyExpensesDelta ?? 0,
    extraMonthlyInvestment: sliderValues.extraMonthlyInvestment ?? 0,
    extraMonthlyDebtPayment: sliderValues.extraMonthlyDebtPayment ?? 0,
    horizonYears: sliderValues.horizonYears ?? 15,
  };
  return whatIf(input, profile);
}
