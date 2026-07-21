import { ClipboardList, Gauge, Lightbulb } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Tell us where you stand",
    description:
      "A quick, guided onboarding covers your income, expenses, debt, assets, and goals — five minutes, not a spreadsheet.",
  },
  {
    icon: Gauge,
    title: "Get your Financial Health Score",
    description:
      "One number that captures your cash flow, debt, savings, and investing health, broken down so you know exactly what's dragging it down.",
  },
  {
    icon: Lightbulb,
    title: "See your next best move",
    description:
      "The decision engine turns your numbers into a ranked list of specific actions — not generic advice, your actual next step.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
        <p className="mt-4 text-muted-foreground">
          Three steps between you and knowing exactly what to do with your next dollar.
        </p>
      </div>
      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="relative rounded-2xl border border-border/60 bg-card p-6">
            <span className="absolute -top-3 -left-3 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {i + 1}
            </span>
            <step.icon className="size-8 text-primary" />
            <h3 className="mt-4 font-medium">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
