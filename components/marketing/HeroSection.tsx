import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoDashboardPreview } from "@/components/marketing/DemoDashboardPreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-grid-fade">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Your financial operating system
        </div>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Your money. Your goals.{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
            Your next best decision.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground">
          Stop guessing with your finances. Get personalized recommendations to save smarter, invest better, and
          build wealth faster.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="h-11 px-6 text-base" nativeButton={false} render={<Link href="/signup" />}>
            Get started free
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 px-6 text-base"
            nativeButton={false}
            render={<Link href="/#how-it-works" />}
          >
            See how it works
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Free forever plan. No credit card required.</p>

        <div className="mt-16 w-full max-w-4xl">
          <DemoDashboardPreview />
        </div>
      </div>
    </section>
  );
}
