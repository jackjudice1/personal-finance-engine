import Link from "next/link";
import {
  Briefcase,
  Car,
  CreditCard,
  Home,
  Landmark,
  Plane,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import type { Goal } from "@/types/financial";
import { GOAL_TYPE_LABELS } from "@/types/financial";
import { projectGoal } from "@/lib/engine/goalProjections";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoalProgressBar } from "@/components/goals/GoalProgressBar";
import { formatCurrency, formatDate } from "@/utils/formatters";

const GOAL_TYPE_ICONS: Record<Goal["type"], typeof Target> = {
  debt_freedom: CreditCard,
  emergency_fund: ShieldCheck,
  home_purchase: Home,
  car_purchase: Car,
  vacation: Plane,
  retirement: Landmark,
  invest_more: Sparkles,
  business: Briefcase,
  custom: Target,
};

export function GoalCard({ goal }: { goal: Goal }) {
  const Icon = GOAL_TYPE_ICONS[goal.type];
  const projection = projectGoal(goal);
  const isComplete = goal.currentAmount >= goal.targetAmount;

  return (
    <Link href={`/dashboard/goals/${goal.id}`}>
      <Card className="h-full transition-colors hover:border-primary/40">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-4.5" />
              </div>
              <div>
                <p className="font-medium">{goal.title}</p>
                <p className="text-xs text-muted-foreground">{GOAL_TYPE_LABELS[goal.type]}</p>
              </div>
            </div>
            {isComplete ? (
              <Badge className="bg-primary text-primary-foreground">Complete</Badge>
            ) : (
              <Badge variant={projection.onTrack ? "outline" : "destructive"}>
                {projection.onTrack ? "On track" : "Behind"}
              </Badge>
            )}
          </div>

          <GoalProgressBar current={goal.currentAmount} target={goal.targetAmount} />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{goal.targetDate ? `Target: ${formatDate(goal.targetDate)}` : "No target date"}</span>
            <span>
              {goal.monthlyContribution > 0 ? `${formatCurrency(goal.monthlyContribution)}/mo` : "No contribution set"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
