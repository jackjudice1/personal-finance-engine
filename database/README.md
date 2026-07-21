# Database setup

This app's schema lives entirely as SQL files in `database/migrations/`. Nothing here has been run against a live database yet — there is no Supabase project associated with this codebase until you create one.

## 1. Create a Supabase project

1. Go to https://supabase.com/dashboard and create a free project.
2. Once provisioned, go to **Project Settings -> API** and copy:
   - Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (keep secret!) -> `SUPABASE_SERVICE_ROLE_KEY`
3. Copy `.env.example` to `.env.local` in the project root and fill in the three values above.

## 1b. Create a Finnhub account (required for the Investing and News tabs)

1. Go to https://finnhub.io/register and create a free account.
2. Copy your API key from the dashboard into `FINNHUB_API_KEY` in `.env.local`.
3. Free tier allows ~60 API calls/minute — plenty for personal use; the app caches and batches requests to stay well under that.

## 2. Run the migrations

**Option A — Supabase SQL editor (fastest, no CLI install):**

Open the SQL editor in your project dashboard and run each file in `database/migrations/` **in order** (0001 through 0014), pasting and executing one at a time.

**Option B — Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
for f in database/migrations/*.sql; do
  npx supabase db execute --file "$f"
done
```

(Or copy the files into a proper `supabase/migrations/` directory and use `supabase db push` if you set up the CLI's migration tooling.)

## 3. Regenerate TypeScript types

Once the schema exists, regenerate `types/database.types.ts` so the app has accurate table types:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > types/database.types.ts
```

Until you do this, `types/database.types.ts` contains a hand-written placeholder that matches the schema below closely enough to keep the app compiling.

## 4. (Optional) Seed demo data

After signing up for an account through the running app (`/signup`), you can seed a realistic financial profile for that user with `database/seed.sql` — see the comment at the top of that file for the exact command (it needs your new user's `auth.users.id`, found in the Supabase dashboard under Authentication -> Users).

## Schema overview

| Table | Purpose |
|---|---|
| `profiles` | Onboarding state, personality mode, theme. Auto-created on signup via trigger. |
| `income_sources` | User's income streams. |
| `expenses` | Monthly expenses by category. |
| `assets` | Savings, investments, retirement, property. |
| `liabilities` | Credit cards, loans, mortgage. |
| `goals` | User-defined financial goals with progress/timeline. |
| `transactions` | Lightweight manual (or future Plaid-imported) transaction log. |
| `recommendations` | Decision-engine output, persisted so the feed doesn't recompute every render. |
| `simulations` | Persisted simulator runs (inputs/outputs as jsonb). |
| `achievements` / `user_levels` | Gamification state. |
| `subscriptions` | Stripe-shaped tier/status row, one per user, created on signup. All Stripe fields are nullable until billing is wired — see `lib/stripe/`. |
| `net_worth_snapshots` | One row per user per day, upserted on dashboard load, powers the net worth trend chart. |
| `health_score_snapshots` | One row per user per day, upserted on dashboard load, powers the Financial Health Score trend chart. |
| `stock_holdings` | One row per user per ticker (adding the same ticker again merges shares/cost basis). Current price is cached from Finnhub, refreshed via `/dashboard/investing`'s "Refresh prices" button. |

Every user-owned table has row-level security enabled (`database/migrations/0011_rls_policies.sql`) scoped to `auth.uid() = user_id`, so users can only ever see their own data — this holds even if application code has a bug, since it's enforced by Postgres itself.
