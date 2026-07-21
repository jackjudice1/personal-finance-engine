-- Individual stock positions, one row per user per ticker (adding the same
-- ticker again merges shares/cost-basis rather than creating a duplicate
-- lot). Additive to the generic 'investment'/'retirement' asset totals -
-- see lib/engine/buildProfile.ts for how this folds into
-- totalInvestmentAssets. Current price is cached (last_price/
-- last_price_fetched_at) rather than fetched from Finnhub on every read.
create table public.stock_holdings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  company_name text,
  shares numeric(14, 4) not null,
  cost_basis_per_share numeric(14, 4) not null,
  last_price numeric(14, 4),
  last_price_fetched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ticker),
  constraint stock_holdings_shares_positive check (shares > 0),
  constraint stock_holdings_cost_basis_nonnegative check (cost_basis_per_share >= 0)
);

create index stock_holdings_user_id_idx on public.stock_holdings (user_id);

alter table public.stock_holdings enable row level security;
create policy "stock_holdings_select_own" on public.stock_holdings for select using (auth.uid() = user_id);
create policy "stock_holdings_insert_own" on public.stock_holdings for insert with check (auth.uid() = user_id);
create policy "stock_holdings_update_own" on public.stock_holdings for update using (auth.uid() = user_id);
create policy "stock_holdings_delete_own" on public.stock_holdings for delete using (auth.uid() = user_id);

create trigger set_updated_at before update on public.stock_holdings
  for each row execute procedure public.set_updated_at();
