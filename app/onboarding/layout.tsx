import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/utils/env";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

// Every route under /onboarding depends on the caller's session and
// database-fetched profile state, so it can never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // No Supabase project configured yet - there can be no authenticated user,
  // so send visitors to /login (with a hint) instead of crashing.
  if (!isSupabaseConfigured()) {
    redirect("/login?error=supabase_not_configured");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.onboarding_completed) {
      redirect("/dashboard");
    }
  }

  return (
    <OnboardingProvider>
      <OnboardingShell>{children}</OnboardingShell>
    </OnboardingProvider>
  );
}
