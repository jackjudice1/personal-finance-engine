-- One row per user per day, upserted on dashboard load - mirrors
-- net_worth_snapshots so the overall Financial Health Score gets a real
-- trend line ("am I actually improving month to month?") instead of only
-- ever showing today's number.
create table public.health_score_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  snapshot_date date not null default current_date,
  overall_score smallint not null,
  cash_flow_score smallint not null,
  debt_score smallint not null,
  savings_score smallint not null,
  investment_score smallint not null,
  created_at timestamptz not null default now(),
  unique (user_id, snapshot_date)
);

create index health_score_snapshots_user_id_idx on public.health_score_snapshots (user_id, snapshot_date);

alter table public.health_score_snapshots enable row level security;
create policy "health_score_snapshots_select_own" on public.health_score_snapshots for select using (auth.uid() = user_id);
create policy "health_score_snapshots_insert_own" on public.health_score_snapshots for insert with check (auth.uid() = user_id);
create policy "health_score_snapshots_update_own" on public.health_score_snapshots for update using (auth.uid() = user_id);
