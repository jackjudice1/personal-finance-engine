import Link from "next/link";
import { SummoraLogo } from "@/components/shared/SummoraLogo";

const FOOTER_LINKS = {
  Product: [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#how-it-works", label: "How it works" },
  ],
  Account: [
    { href: "/signup", label: "Sign up" },
    { href: "/login", label: "Log in" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs space-y-3">
            <Link href="/" className="flex items-center">
              <SummoraLogo className="h-6 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your money. Your goals. Your next best decision.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading} className="space-y-3">
                <h3 className="text-sm font-medium">{heading}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Summora Systems. Not a registered investment advisor — recommendations are
          educational, not financial advice. See our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}
