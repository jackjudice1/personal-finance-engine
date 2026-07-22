"use client";

import { usePathname } from "next/navigation";
import { SummoraLogo } from "@/components/shared/SummoraLogo";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/lib/validations/onboarding";

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).at(-1);
  const currentStep: OnboardingStep = (ONBOARDING_STEPS as readonly string[]).includes(segment ?? "")
    ? (segment as OnboardingStep)
    : "income";

  const isCompleteScreen = pathname.endsWith("/complete");

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10 sm:px-6">
      <div className="mb-10 flex items-center self-center">
        <SummoraLogo className="h-8 w-auto" />
      </div>
      {!isCompleteScreen && (
        <div className="mb-10">
          <OnboardingStepper currentStep={currentStep} />
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
