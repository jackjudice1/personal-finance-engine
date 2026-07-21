import Link from "next/link";
import { ArrowRight, Calculator, ShoppingCart, Sliders } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialDisclaimerBanner } from "@/components/shared/FinancialDisclaimerBanner";

const SIMULATORS = [
  {
    href: "/dashboard/simulators/can-i-afford-this",
    icon: ShoppingCart,
    title: "Can I Afford This?",
    description: "See how a purchase affects your savings rate and goal timelines before you buy.",
  },
  {
    href: "/dashboard/simulators/debt-vs-investing",
    icon: Calculator,
    title: "Debt vs. Investing",
    description: "Compare paying down debt against investing the same extra dollars, long term.",
  },
  {
    href: "/dashboard/simulators/what-if",
    icon: Sliders,
    title: "What-If Simulator",
    description: "Slide income, expenses, and contributions to see your projected net worth change live.",
  },
];

export default function SimulatorsHubPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Simulators</h1>
        <p className="text-sm text-muted-foreground">Test decisions before you make them.</p>
      </div>
      <FinancialDisclaimerBanner />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SIMULATORS.map((sim) => (
          <Link key={sim.href} href={sim.href}>
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <sim.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{sim.title}</CardTitle>
                <CardDescription>{sim.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Run simulator
                  <ArrowRight className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
