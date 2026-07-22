import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Maps a 0-100 "higher is better" score/percent to the app's semantic color tokens - shared by health score, coach progress cards, and debt payoff progress. */
export function getUrgencyColor(percent: number): string {
  if (percent >= 70) return "bg-primary"
  if (percent >= 40) return "bg-warning"
  return "bg-destructive"
}
