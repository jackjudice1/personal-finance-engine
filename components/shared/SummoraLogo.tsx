import Image from "next/image";
import logoLight from "@/public/logo-light.png";
import logoDark from "@/public/logo-dark.png";
import { cn } from "@/lib/utils";

/**
 * The Summora Systems wordmark. Renders both theme variants and swaps them
 * with CSS (same `dark:` convention as ThemeToggle), so there's no
 * client-side theme read or hydration flash.
 */
export function SummoraLogo({ className }: { className?: string }) {
  return (
    <>
      <Image
        src={logoLight}
        alt="Summora Systems"
        priority
        className={cn("h-7 w-auto dark:hidden", className)}
      />
      <Image
        src={logoDark}
        alt="Summora Systems"
        priority
        className={cn("hidden h-7 w-auto dark:block", className)}
      />
    </>
  );
}
