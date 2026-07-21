"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Calculator,
  CreditCard,
  LayoutDashboard,
  Newspaper,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SummitLogo } from "@/components/shared/SummitLogo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/debts", label: "Debts", icon: CreditCard },
  { href: "/dashboard/investing", label: "Investing", icon: TrendingUp },
  { href: "/dashboard/news", label: "News", icon: Newspaper },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/dashboard/simulators", label: "Simulators", icon: Calculator },
  { href: "/dashboard/assistant", label: "AI Coach", icon: Bot },
  { href: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card/40 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 px-5 font-semibold tracking-tight">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <SummitLogo className="size-4.5" />
        </span>
        Summit
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/15 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
