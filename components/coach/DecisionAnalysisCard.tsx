import { Check, X } from "lucide-react";
import type { DecisionAnalysis, CoachRiskLevel } from "@/types/coach";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatCurrency } from "@/utils/formatters";

const RISK_STYLES: Record<CoachRiskLevel, string> = {
  low: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/15 text-destructive",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

export function DecisionAnalysisCard({ analysis }: { analysis: DecisionAnalysis }) {
  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Decision Analysis — {analysis.purchaseLabel}</span>
          <Badge variant="outline" className={`border-transparent ${RISK_STYLES[analysis.riskLevel]}`}>
            {analysis.riskLevel} risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            {analysis.pros.map((pro, i) => (
              <p key={i} className="flex items-start gap-1.5 text-sm">
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                {pro}
              </p>
            ))}
          </div>
          <div className="space-y-1.5">
            {analysis.cons.map((con, i) => (
              <p key={i} className="flex items-start gap-1.5 text-sm">
                <X className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                {con}
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-accent/50 p-3 sm:grid-cols-4">
          <Stat label="Monthly Payment" value={formatCurrency(analysis.monthlyPaymentEstimate)} />
          {analysis.insuranceEstimate !== null && <Stat label="Est. Insurance/mo" value={formatCurrency(analysis.insuranceEstimate)} />}
          <Stat label="Opportunity Cost (10yr)" value={formatCurrency(analysis.opportunityCost)} />
          <Stat label="Health Score" value={`${analysis.healthScoreBefore} → ${analysis.healthScoreAfter}`} />
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{analysis.retirementImpact}</p>
          <p>{analysis.emergencyFundImpact}</p>
        </div>

        <p className="text-sm font-medium">{analysis.recommendation}</p>

        <Accordion>
          <AccordionItem value="assumptions">
            <AccordionTrigger className="text-xs text-muted-foreground">Assumptions used</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                {analysis.assumptions.map((assumption, i) => (
                  <li key={i}>{assumption}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
