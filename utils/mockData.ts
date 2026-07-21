/** Static fixture data for the landing page's demo dashboard preview. Never
 * fetched from Supabase — purely illustrative. */

export const demoHealthScore = {
  overall: 78,
  cashFlow: 82,
  debt: 64,
  savings: 88,
  investment: 74,
};

export const demoNetWorthTrend = [
  { month: "Feb", netWorth: 24500 },
  { month: "Mar", netWorth: 26100 },
  { month: "Apr", netWorth: 27400 },
  { month: "May", netWorth: 29800 },
  { month: "Jun", netWorth: 31200 },
  { month: "Jul", netWorth: 34650 },
];

export const demoSnapshot = {
  monthlyIncome: 6600,
  monthlyExpenses: 4380,
  savingsRate: 0.34,
  debtRemaining: 21700,
  investmentBalance: 33500,
  emergencyFund: 4500,
};

export const demoRecommendations = [
  {
    severity: "urgent" as const,
    title: "Pay off your credit card before increasing investments",
    description: "Your Visa balance carries 22.99% APR — that's costing more than any realistic investment return.",
  },
  {
    severity: "suggested" as const,
    title: "You can safely increase your monthly rent budget by $300",
    description: "Your savings rate is healthy enough to absorb a higher housing cost without derailing your goals.",
  },
  {
    severity: "info" as const,
    title: "Your emergency fund is below your recommended target",
    description: "You're at $4,500 of a $15,000 target (3 months of expenses). Keep the pace — 10 months to go.",
  },
];

export const demoGoals = [
  { title: "Emergency Fund", current: 4500, target: 15000, monthsRemaining: 10 },
  { title: "Pay off Credit Card", current: 0, target: 3200, monthsRemaining: 8 },
  { title: "House Down Payment", current: 8000, target: 60000, monthsRemaining: 36 },
];
