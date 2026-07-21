"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PREMIUM_FEATURES = [
  "AI financial assistant",
  "Advanced what-if simulations",
  "Unlimited goals",
  "Long-range wealth projections",
];

export function UpgradeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-premium/15 text-premium">
            <Sparkles className="size-5" />
          </div>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>$9.99/month. Cancel anytime.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          {PREMIUM_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full" nativeButton={false} render={<Link href="/dashboard/settings/billing" />}>
          See billing options
        </Button>
      </DialogContent>
    </Dialog>
  );
}
