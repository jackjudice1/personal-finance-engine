import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is not set"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

/** Cheap check for server-side route guards, before constructing a full Supabase client. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

let cached: ClientEnv | null = null;

/**
 * Validated accessor for the client-safe env vars. Throws a clear error at
 * first use (not at import time) if Supabase credentials haven't been
 * provisioned yet, instead of failing deep inside a Supabase client call.
 */
export function getClientEnv(): ClientEnv {
  if (cached) return cached;
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  });
  if (!parsed.success) {
    throw new Error(
      `Missing/invalid environment variables: ${parsed.error.issues
        .map((i) => i.path.join("."))
        .join(", ")}. Copy .env.example to .env.local and fill in your Supabase project credentials.`
    );
  }
  cached = parsed.data;
  return cached;
}
