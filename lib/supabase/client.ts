import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { getClientEnv } from "@/utils/env";

/** Browser-side Supabase client for use in Client Components/hooks. */
export function createClient() {
  const env = getClientEnv();
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
