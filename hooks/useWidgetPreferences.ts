"use client";

import { useEffect, useState } from "react";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

export interface WidgetPreferences {
  healthScore: boolean;
  netWorth: boolean;
  snapshot: boolean;
  recommendations: boolean;
}

const DEFAULT_PREFERENCES: WidgetPreferences = {
  healthScore: true,
  netWorth: true,
  snapshot: true,
  recommendations: true,
};

function storageKey(userId: string) {
  return `pfde:widget-preferences:${userId}`;
}

export function useWidgetPreferences() {
  const { user } = useSupabaseUser();
  const [preferences, setPreferences] = useState<WidgetPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      // One-time sync from localStorage once the user id is known - the
      // storage key depends on an async value, so this can't be a lazy
      // useState initializer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
    } catch {
      // ignore malformed localStorage state
    }
  }, [user]);

  function setPreference(key: keyof WidgetPreferences, value: boolean) {
    if (!user) return;
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    localStorage.setItem(storageKey(user.id), JSON.stringify(next));
  }

  return { preferences, setPreference };
}
