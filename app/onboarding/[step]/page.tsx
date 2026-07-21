import { notFound } from "next/navigation";
import { IncomeStepForm } from "@/components/onboarding/IncomeStepForm";
import { ExpensesStepForm } from "@/components/onboarding/ExpensesStepForm";
import { DebtStepForm } from "@/components/onboarding/DebtStepForm";
import { AssetsStepForm } from "@/components/onboarding/AssetsStepForm";
import { GoalsStepForm } from "@/components/onboarding/GoalsStepForm";
import { ReviewStep } from "@/components/onboarding/ReviewStep";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/lib/validations/onboarding";

const STEP_COMPONENTS: Record<OnboardingStep, React.ComponentType> = {
  income: IncomeStepForm,
  expenses: ExpensesStepForm,
  debt: DebtStepForm,
  assets: AssetsStepForm,
  goals: GoalsStepForm,
  review: ReviewStep,
};

export default async function OnboardingStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;

  if (!(ONBOARDING_STEPS as readonly string[]).includes(step)) {
    notFound();
  }

  const StepComponent = STEP_COMPONENTS[step as OnboardingStep];
  return <StepComponent />;
}
