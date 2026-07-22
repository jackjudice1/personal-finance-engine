"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { PartyPopper } from "lucide-react";
import type { Liability } from "@/types/financial";

const STORAGE_KEY = "summit:debt-balances";

function readSnapshot(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * Fires a confetti burst + toast every time a debt crosses from a positive
 * balance to zero, compared against the last-seen snapshot in
 * sessionStorage - not just the first-ever payoff (that's what the
 * persisted "Debt Destroyer" achievement is for). sessionStorage, not a
 * plain ref, is required here: the actual "log a payment" flow lives on
 * the debt detail page, so this list page always unmounts and remounts
 * around every payment - a ref would reset and never see the transition.
 */
export function DebtCelebration({ debts }: { debts: Liability[] }) {
  useEffect(() => {
    if (debts.length === 0) return;
    const previous = readSnapshot();
    const hasBaseline = Object.keys(previous).length > 0;

    if (hasBaseline) {
      for (const debt of debts) {
        const prevBalance = previous[debt.id];
        if (prevBalance !== undefined && prevBalance > 0 && debt.balance === 0) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          toast(`Congratulations! You just eliminated your ${debt.label}.`, {
            icon: <PartyPopper className="size-4 text-primary" />,
            description: "One less thing standing between you and financial freedom.",
          });
        }
      }
    }

    const next = Object.fromEntries(debts.map((d) => [d.id, d.balance]));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [debts]);

  return null;
}
