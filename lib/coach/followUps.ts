import type { CoachCategory } from "@/types/coach";

/**
 * Every phrase here is hand-verified to trigger a real, grounded handler in
 * answerCoachQuestion.ts (not the generic top-recommendation fallback) - the
 * engine has no memory between messages, so a vague follow-up like "show me
 * the numbers" or "how does this affect retirement?" can't be answered
 * meaningfully without context, and would otherwise just repeat the same
 * fallback recommendation every time.
 */
const FOLLOW_UPS: Record<CoachCategory, string[]> = {
  investment_advice: ["What if I invested more?", "How's my retirement looking?", "Am I overspending?"],
  debt_payoff: ["What if I paid off debt faster?", "Should I pay off debt or invest?", "Am I overspending?"],
  retirement: ["Should I invest in stocks?", "What if I invested more?", "How's my financial health?"],
  budgeting: ["What subscriptions should I cancel?", "How much should I save each month?", "Am I overspending?"],
  emergency_fund: [
    "How long until I reach my emergency fund goal?",
    "How much should I save each month?",
    "Am I overspending?",
  ],
  taxes: ["What's hurting my finances most?", "Am I overspending?", "How's my financial health?"],
  credit_score: ["Should I pay off debt or invest?", "What's hurting my finances most?", "How's my financial health?"],
  home_buying: ["Can I afford a house?", "What if I bought a house?", "How's my financial health?"],
  car_buying: ["Can I afford a new car?", "What if I bought a car?", "How's my financial health?"],
  large_purchase: ["Can I afford a new car?", "How much should I save each month?", "How's my financial health?"],
  salary_negotiation: ["What if I got a raise?", "How's my financial health?", "Am I overspending?"],
  career_decisions: ["What if I got a raise?", "How's my financial health?", "Am I overspending?"],
  college_savings: ["How much should I save each month?", "How's my financial health?", "Am I overspending?"],
  insurance: ["Am I overspending?", "How's my financial health?", "What's hurting my finances most?"],
  cash_flow: ["What's hurting my finances most?", "Am I overspending?", "How much should I save each month?"],
  general: ["Can I afford a new car?", "Am I overspending?", "What's hurting my finances most?"],
};

export function getFollowUps(category: CoachCategory): string[] {
  return FOLLOW_UPS[category];
}
