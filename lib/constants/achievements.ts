import type { AchievementDefinition } from "@/types/gamification";

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    key: "first_1000_saved",
    title: "First $1,000 Saved",
    description: "You've built your first $1,000 in savings or investments.",
    icon: "PiggyBank",
    predicate: (profile) => profile.totalAssets >= 1000,
  },
  {
    key: "debt_destroyer",
    title: "Debt Destroyer",
    description: "You've paid off a debt in full.",
    icon: "Swords",
    predicate: (profile) => profile.liabilities.some((l) => l.balance === 0),
  },
  {
    key: "first_investment",
    title: "First Investment",
    description: "You've opened your first investment account.",
    icon: "TrendingUp",
    predicate: (profile) => profile.totalInvestmentAssets > 0,
  },
  {
    key: "ten_percent_savings_rate",
    title: "10% Savings Rate",
    description: "You're saving at least 10% of your income.",
    icon: "PercentCircle",
    predicate: (profile) => profile.savingsRate >= 0.1,
  },
  {
    key: "emergency_fund_complete",
    title: "Emergency Fund Complete",
    description: "Your emergency fund covers 3+ months of expenses.",
    icon: "ShieldCheck",
    predicate: (profile) => profile.emergencyFundBalance >= profile.monthlyExpenses * 3 && profile.monthlyExpenses > 0,
  },
  {
    key: "health_score_80",
    title: "Financially Fit",
    description: "Your Financial Health Score crossed 80.",
    icon: "HeartPulse",
    predicate: (_profile, health) => health.overall >= 80,
  },
];
