"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import type { Recommendation } from "@/types/engine";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

function storageKey(userId: string) {
  return `pfde:dismissed-recommendations:${userId}`;
}

export function RecommendationFeed({
  recommendations,
  limit,
  dismissible = false,
}: {
  recommendations: Recommendation[];
  limit?: number;
  dismissible?: boolean;
}) {
  const { user } = useSupabaseUser();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || !dismissible) return;
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      // One-time sync from localStorage once the user id is known - the
      // storage key depends on an async value, so this can't be a lazy
      // useState initializer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDismissed(new Set(JSON.parse(raw)));
    } catch {
      // ignore malformed localStorage state
    }
  }, [user, dismissible]);

  function handleDismiss(ruleId: string) {
    if (!user) return;
    const next = new Set(dismissed);
    next.add(ruleId);
    setDismissed(next);
    localStorage.setItem(storageKey(user.id), JSON.stringify(Array.from(next)));
  }

  const visible = recommendations.filter((r) => !dismissed.has(r.ruleId)).slice(0, limit);

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 p-8 text-center">
        <PartyPopper className="size-6 text-primary" />
        <p className="text-sm font-medium">You&apos;re all caught up</p>
        <p className="text-sm text-muted-foreground">No urgent moves right now — check back as your numbers change.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visible.map((rec) => (
        <RecommendationCard
          key={rec.ruleId + (rec.relatedGoalId ?? "")}
          recommendation={rec}
          onDismiss={dismissible ? () => handleDismiss(rec.ruleId) : undefined}
        />
      ))}
    </div>
  );
}
