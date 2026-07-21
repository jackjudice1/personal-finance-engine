-- Lightweight manual transaction log. Designed so Plaid-imported rows can
-- slot into the same table later without a schema change.
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_at date not null default current_date,
  description text,
  amount numeric(12, 2) not null, -- negative = expense, positive = income
  category expense_category,
  source text not null default 'manual' check (source in ('manual', 'plaid')),
  plaid_transaction_id text,
  created_at timestamptz not null default now()
);

create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_occurred_at_idx on public.transactions (user_id, occurred_at desc);
