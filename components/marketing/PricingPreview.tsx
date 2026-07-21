import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PricingTable } from "@/components/billing/PricingTable";

export function PricingPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple, honest pricing</h2>
        <p className="mt-4 text-muted-foreground">Start free. Upgrade when you want the AI assistant and advanced simulations.</p>
      </div>
      <div className="mt-14">
        <PricingTable />
      </div>
      <div className="mt-8 text-center">
        <Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Compare all features
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
