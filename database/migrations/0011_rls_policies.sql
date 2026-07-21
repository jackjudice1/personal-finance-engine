-- Row Level Security: every table is user-scoped. Pattern is identical per
-- table (select/insert/update/delete gated on auth.uid() = user_id), except
-- `profiles` (gated on auth.uid() = id) and `subscriptions` (client is
-- select-only; writes come from a service-role webhook handler later).

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
-- insert handled by handle_new_user() trigger (security definer)

alter table public.income_sources enable row level security;
create policy "income_sources_select_own" on public.income_sources for select using (auth.uid() = user_id);
create policy "income_sources_insert_own" on public.income_sources for insert with check (auth.uid() = user_id);
create policy "income_sources_update_own" on public.income_sources for update using (auth.uid() = user_id);
create policy "income_sources_delete_own" on public.income_sources for delete using (auth.uid() = user_id);

alter table public.expenses enable row level security;
create policy "expenses_select_own" on public.expenses for select using (auth.uid() = user_id);
create policy "expenses_insert_own" on public.expenses for insert with check (auth.uid() = user_id);
create policy "expenses_update_own" on public.expenses for update using (auth.uid() = user_id);
create policy "expenses_delete_own" on public.expenses for delete using (auth.uid() = user_id);

alter table public.assets enable row level security;
create policy "assets_select_own" on public.assets for select using (auth.uid() = user_id);
create policy "assets_insert_own" on public.assets for insert with check (auth.uid() = user_id);
create policy "assets_update_own" on public.assets for update using (auth.uid() = user_id);
create policy "assets_delete_own" on public.assets for delete using (auth.uid() = user_id);

alter table public.liabilities enable row level security;
create policy "liabilities_select_own" on public.liabilities for select using (auth.uid() = user_id);
create policy "liabilities_insert_own" on public.liabilities for insert with check (auth.uid() = user_id);
create policy "liabilities_update_own" on public.liabilities for update using (auth.uid() = user_id);
create policy "liabilities_delete_own" on public.liabilities for delete using (auth.uid() = user_id);

alter table public.goals enable row level security;
create policy "goals_select_own" on public.goals for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals for update using (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals for delete using (auth.uid() = user_id);

alter table public.transactions enable row level security;
create policy "transactions_select_own" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions for update using (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions for delete using (auth.uid() = user_id);

alter table public.recommendations enable row level security;
create policy "recommendations_select_own" on public.recommendations for select using (auth.uid() = user_id);
create policy "recommendations_insert_own" on public.recommendations for insert with check (auth.uid() = user_id);
create policy "recommendations_update_own" on public.recommendations for update using (auth.uid() = user_id);
create policy "recommendations_delete_own" on public.recommendations for delete using (auth.uid() = user_id);

alter table public.simulations enable row level security;
create policy "simulations_select_own" on public.simulations for select using (auth.uid() = user_id);
create policy "simulations_insert_own" on public.simulations for insert with check (auth.uid() = user_id);
create policy "simulations_delete_own" on public.simulations for delete using (auth.uid() = user_id);

alter table public.achievements enable row level security;
create policy "achievements_select_own" on public.achievements for select using (auth.uid() = user_id);
create policy "achievements_insert_own" on public.achievements for insert with check (auth.uid() = user_id);

alter table public.user_levels enable row level security;
create policy "user_levels_select_own" on public.user_levels for select using (auth.uid() = user_id);
create policy "user_levels_upsert_own" on public.user_levels for insert with check (auth.uid() = user_id);
create policy "user_levels_update_own" on public.user_levels for update using (auth.uid() = user_id);

alter table public.net_worth_snapshots enable row level security;
create policy "net_worth_snapshots_select_own" on public.net_worth_snapshots for select using (auth.uid() = user_id);
create policy "net_worth_snapshots_insert_own" on public.net_worth_snapshots for insert with check (auth.uid() = user_id);
create policy "net_worth_snapshots_update_own" on public.net_worth_snapshots for update using (auth.uid() = user_id);

-- Subscriptions: client can read its own row, but cannot write. Writes are
-- reserved for a future service-role Stripe webhook handler, which bypasses
-- RLS entirely via the service_role key (see lib/supabase/admin.ts).
alter table public.subscriptions enable row level security;
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
