import type { Metadata } from "next";
import { PricingTable } from "@/components/billing/PricingTable";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, honest pricing for Summora Systems.",
};

const FAQ = [
  {
    q: "Is my financial data safe?",
    a: "Your data is stored in a database scoped entirely to your account with row-level security — no other user, and no unauthenticated request, can ever read or write your rows.",
  },
  {
    q: "Can I cancel Premium anytime?",
    a: "Yes, cancel anytime and you'll keep Premium access through the end of your current billing period.",
  },
  {
    q: "Do you connect to my bank?",
    a: "Not yet — today you enter your numbers manually during onboarding. Direct bank connections (via Plaid) are on the roadmap.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Recommendations are educational and rule-based, generated from the numbers you provide. We are not a registered investment advisor.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Simple, honest pricing</h1>
        <p className="mt-4 text-muted-foreground">
          Start free. Upgrade when you want the AI assistant and advanced simulations.
        </p>
      </div>
      <div className="mt-14">
        <PricingTable />
      </div>
      <div className="mx-auto mt-24 max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <dl className="mt-8 space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="border-b border-border/60 pb-6">
              <dt className="font-medium">{item.q}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
