import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to see where you stand and what to do next.",
    features: [
      "Financial Health Score",
      "Net worth tracker",
      "Manual income, expense & goal tracking",
      "Core recommendation feed",
      "Up to 3 active goals",
      "Levels & achievements",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    description: "For people actively optimizing every dollar.",
    features: [
      "Everything in Free",
      "AI financial assistant",
      "Advanced what-if simulations",
      "Unlimited goals",
      "Long-range wealth projections",
      "Personalized, prioritized recommendations",
    ],
    cta: "Start Premium",
    href: "/signup",
    highlighted: true,
  },
];

export function PricingTable() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
      {PLANS.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            "relative",
            plan.highlighted && "border-primary/60 shadow-lg shadow-primary/10 ring-1 ring-primary/30"
          )}
        >
          {plan.highlighted && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-premium text-premium-foreground">
              Most popular
            </Badge>
          )}
          <CardHeader>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2.5 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={plan.highlighted ? "default" : "outline"}
              nativeButton={false}
              render={<Link href={plan.href} />}
            >
              {plan.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
