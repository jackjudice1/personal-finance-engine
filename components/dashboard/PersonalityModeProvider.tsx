"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { FinancialPersonality } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

interface PersonalityModeContextValue {
  mode: FinancialPersonality;
  setMode: (mode: FinancialPersonality) => Promise<void>;
  isSaving: boolean;
}

const PersonalityModeContext = createContext<PersonalityModeContextValue | null>(null);

export function PersonalityModeProvider({
  initialMode,
  children,
}: {
  initialMode: FinancialPersonality;
  children: ReactNode;
}) {
  const { user } = useSupabaseUser();
  const [mode, setModeState] = useState<FinancialPersonality>(initialMode);
  const [isSaving, setIsSaving] = useState(false);

  async function setMode(next: FinancialPersonality) {
    setModeState(next);
    if (!user) return;
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ financial_personality: next }).eq("id", user.id);
    setIsSaving(false);
  }

  return (
    <PersonalityModeContext.Provider value={{ mode, setMode, isSaving }}>{children}</PersonalityModeContext.Provider>
  );
}

export function usePersonalityMode() {
  const ctx = useContext(PersonalityModeContext);
  if (!ctx) throw new Error("usePersonalityMode must be used within PersonalityModeProvider");
  return ctx;
}
