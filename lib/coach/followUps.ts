import type { CoachCategory } from "@/types/coach";

const FOLLOW_UPS: Record<CoachCategory, string[]> = {
  investment_advice: ["What if I invest more?", "How risky is that?", "Show me the numbers"],
  debt_payoff: ["What if I paid off debt faster?", "Should I invest instead?", "Create a payoff plan"],
  retirement: ["What if I contributed more?", "Am I on track?", "Show me the numbers"],
  budgeting: ["What subscriptions should I cancel?", "How can I save $500/month?", "Show my spending breakdown"],
  emergency_fund: ["How long until I reach my goal?", "What if I saved more each month?", "Is 3 months enough?"],
  taxes: ["What else can I deduct?", "How does this affect next year?", "Show me the numbers"],
  credit_score: ["What's hurting my score most?", "How long will this take?", "What should I do first?"],
  home_buying: ["What if I waited a year?", "Show me the numbers", "How much house can I afford?"],
  car_buying: ["What if I waited a year?", "Show me the numbers", "What about a cheaper model?"],
  large_purchase: ["What if I wait a year?", "Show me the numbers", "Create a savings plan"],
  salary_negotiation: ["What if I got a bigger raise?", "How should I counter?", "Show me the numbers"],
  career_decisions: ["What if I took the new job?", "How does this affect retirement?", "Show me the numbers"],
  college_savings: ["What if I saved more each month?", "Am I on track?", "Show me the numbers"],
  insurance: ["Am I over-insured?", "What should I shop around for?", "Show me the numbers"],
  cash_flow: ["What's hurting my finances most?", "How can I save $500/month?", "Show my spending breakdown"],
  general: ["Can I afford a new car?", "Am I overspending?", "What's hurting my finances most?"],
};

export function getFollowUps(category: CoachCategory): string[] {
  return FOLLOW_UPS[category];
}
