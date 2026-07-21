import { Bot, Calculator, Gauge, Sparkles, Target, Trophy } from "lucide-react";

const FEATURES = [
  {
    icon: Gauge,
    title: "Financial Health Score",
    description: "One 0-100 score, broken into cash flow, debt, savings, and investing sub-scores.",
  },
  {
    icon: Sparkles,
    title: "Decision Engine",
    description: "Prescriptive recommendations grounded in your real numbers — not generic budgeting tips.",
  },
  {
    icon: Target,
    title: "Goals with real timelines",
    description: "House, car, debt freedom, retirement — each with a progress bar and required monthly contribution.",
  },
  {
    icon: Calculator,
    title: "What-if simulators",
    description: "Can I afford this? Debt vs. investing? Slide the numbers and see your future net worth change live.",
  },
  {
    icon: Trophy,
    title: "Levels & achievements",
    description: "Beginner to Financial Master — building wealth should feel like progress, not paperwork.",
  },
  {
    icon: Bot,
    title: "AI financial assistant",
    description: "Ask \"Can I afford a Tesla?\" and get an answer grounded in your actual goals and cash flow.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to build wealth</h2>
          <p className="mt-4 text-muted-foreground">
            Not another budgeting app. A financial operating system that tells you what to do next.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border/60 bg-card p-6">
              <feature.icon className="size-6 text-primary" />
              <h3 className="mt-4 font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
