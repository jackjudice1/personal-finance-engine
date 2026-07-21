"use client";

import { useMemo } from "react";
import { calculateHealthScore } from "@/lib/engine/healthScore";
import type { FinancialProfile } from "@/types/financial";

export function useHealthScore(profile: FinancialProfile | null) {
  return useMemo(() => (profile ? calculateHealthScore(profile) : null), [profile]);
}
