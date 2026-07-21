import type { CoachCategory } from "@/types/coach";

/**
 * Ordered most-specific-first: a question like "should I invest in a house"
 * needs "house" to win over "invest", so home/car/large-purchase patterns
 * are checked before the more general investment/debt patterns.
 */
const CATEGORY_PATTERNS: { category: CoachCategory; pattern: RegExp }[] = [
  { category: "home_buying", pattern: /\b(house|home|mortgage|down payment)\b/i },
  { category: "car_buying", pattern: /\b(car|vehicle|auto loan|tesla|truck)\b/i },
  { category: "college_savings", pattern: /\b(college|tuition|529|student)\b/i },
  { category: "retirement", pattern: /\b(retire|retirement|401k|ira)\b/i },
  { category: "credit_score", pattern: /\b(credit score|fico|credit report)\b/i },
  { category: "taxes", pattern: /\b(tax|taxes|deduction|write.?off)\b/i },
  { category: "insurance", pattern: /\b(insurance|premium|deductible|policy)\b/i },
  { category: "salary_negotiation", pattern: /\b(negotiat|raise|salary offer|counter.?offer)\b/i },
  { category: "career_decisions", pattern: /\b(job offer|career|switch jobs|quit my job|new job)\b/i },
  { category: "emergency_fund", pattern: /\b(emergency fund)\b/i },
  { category: "debt_payoff", pattern: /\b(pay off|payoff|debt)\b/i },
  { category: "investment_advice", pattern: /\b(invest|investing|stock|etf|portfolio)\b/i },
  { category: "budgeting", pattern: /\b(budget|overspend(?:ing)?|spending|subscriptions?|cut costs|save|saving)\b/i },
  { category: "cash_flow", pattern: /\b(cash flow|paycheck to paycheck|hurting)\b/i },
  { category: "large_purchase", pattern: /\b(afford|buy|purchase|get a)\b/i },
];

/** Rule-based categorizer: the first matching pattern wins, else "general". */
export function categorize(question: string): CoachCategory {
  for (const { category, pattern } of CATEGORY_PATTERNS) {
    if (pattern.test(question)) return category;
  }
  return "general";
}
