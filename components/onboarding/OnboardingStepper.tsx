"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/lib/validations/onboarding";

const STEP_LABELS: Record<OnboardingStep, string> = {
  income: "Income",
  expenses: "Expenses",
  debt: "Debt",
  assets: "Assets",
  goals: "Goals",
  review: "Review",
};

export function OnboardingStepper({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center">
        {ONBOARDING_STEPS.map((step, i) => {
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                    isComplete && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isComplete && !isCurrent && "border-border text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-[11px] sm:block",
                    isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {i < ONBOARDING_STEPS.length - 1 && (
                <div className={cn("mx-2 h-px flex-1", isComplete ? "bg-primary" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
