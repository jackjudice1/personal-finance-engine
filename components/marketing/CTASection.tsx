import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center sm:p-16">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Your next best financial decision is a few minutes away.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Free forever plan. No credit card required. Cancel anytime.
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" className="h-11 px-6 text-base" nativeButton={false} render={<Link href="/signup" />}>
            Get started free
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
