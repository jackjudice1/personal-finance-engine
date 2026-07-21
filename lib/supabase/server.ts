import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import { getClientEnv } from "@/utils/env";

/**
 * Server-side Supabase client for Server Components, Route Handlers, and
 * Server Actions. Cookie writes are wrapped in a try/catch because Server
 * Components can call this read-only — the session refresh actually
 * happens in middleware.ts, this is just a no-op fallback there.
 */
export async function createClient() {
  const env = getClientEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component - session refresh happens in middleware.
        }
      },
    },
  });
}
