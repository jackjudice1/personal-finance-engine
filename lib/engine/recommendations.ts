import type { FinancialProfile } from "@/types/financial";
import type { Recommendation } from "@/types/engine";
import { evaluate as evaluateDebtRules } from "@/lib/engine/rules/debtRules";
import { evaluate as evaluateEmergencyFundRules } from "@/lib/engine/rules/emergencyFundRules";
import { evaluate as evaluateInvestingRules } from "@/lib/engine/rules/investingRules";
import { evaluate as evaluateCashFlowRules } from "@/lib/engine/rules/cashFlowRules";
import { evaluate as evaluateGoalRules } from "@/lib/engine/rules/goalRules";

const SEVERITY_RANK: Record<Recommendation["severity"], number> = {
  urgent: 0,
  suggested: 1,
  info: 2,
};

const MAX_RECOMMENDATIONS = 12;

/**
 * Composes every rule module into a single ranked recommendation list.
 * Each rule module is a pure function of FinancialProfile -> Recommendation[],
 * so rules can be unit tested in isolation and added/removed independently.
 */
export function generateRecommendations(profile: FinancialProfile): Recommendation[] {
  const all = [
    ...evaluateDebtRules(profile),
    ...evaluateEmergencyFundRules(profile),
    ...evaluateInvestingRules(profile),
    ...evaluateCashFlowRules(profile),
    ...evaluateGoalRules(profile),
  ];

  const deduped = Array.from(new Map(all.map((r) => [`${r.ruleId}:${r.relatedGoalId ?? ""}`, r])).values());

  return deduped.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]).slice(0, MAX_RECOMMENDATIONS);
}
