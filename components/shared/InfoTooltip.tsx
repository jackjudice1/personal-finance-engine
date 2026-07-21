"use client";

import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** Small "i" button that reveals a plain-language explanation on click/tap — works on both desktop and mobile, unlike a hover-only tooltip. */
export function InfoTooltip({ text }: { text: string }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="How this is calculated"
        className="inline-flex items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Info className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent className="w-64 text-xs leading-relaxed text-muted-foreground">{text}</PopoverContent>
    </Popover>
  );
}
