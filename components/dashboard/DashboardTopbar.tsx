"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, Settings, Sparkles, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SummoraLogo } from "@/components/shared/SummoraLogo";
import { MobileNav } from "@/components/dashboard/MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSupabaseUser();
  // Every tab except AI Coach gets a one-tap way back to the dashboard -
  // the sidebar/mobile nav can do this too, but this covers pages that
  // don't otherwise have any back navigation (goal/debt detail, "new" forms).
  const showBackToDashboard = pathname !== "/dashboard" && !pathname.startsWith("/dashboard/assistant");

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials = (user?.user_metadata?.full_name as string | undefined)
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="lg:hidden">
          <MobileNav />
        </div>
        {showBackToDashboard ? (
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard" />}>
            <ArrowLeft className="size-4" />
            Dashboard
          </Button>
        ) : (
          <div className="lg:hidden">
            <SummoraLogo className="h-6 w-auto" />
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/dashboard/settings/billing" />}>
          <Sparkles className="size-3.5 text-premium" />
          Upgrade
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <Avatar className="size-8">
                  <AvatarFallback>{initials ?? <User className="size-4" />}</AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
