-- One row per user per day, upserted on dashboard load. Gives the net worth
-- chart a real trend line without needing a cron job or Plaid history.
create table public.net_worth_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  snapshot_date date not null default current_date,
  total_assets numeric(14, 2) not null,
  total_liabilities numeric(14, 2) not null,
  net_worth numeric(14, 2) not null,
  created_at timestamptz not null default now(),
  unique (user_id, snapshot_date)
);

create index net_worth_snapshots_user_id_idx on public.net_worth_snapshots (user_id, snapshot_date);
