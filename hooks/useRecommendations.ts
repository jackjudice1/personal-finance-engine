"use client";

import { useMemo } from "react";
import { generateRecommendations } from "@/lib/engine/recommendations";
import type { FinancialProfile } from "@/types/financial";

export function useRecommendations(profile: FinancialProfile | null) {
  return useMemo(() => (profile ? generateRecommendations(profile) : []), [profile]);
}
