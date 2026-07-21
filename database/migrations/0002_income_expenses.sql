create type income_frequency as enum ('weekly', 'biweekly', 'monthly', 'annually');
create type expense_category as enum (
  'housing', 'transportation', 'food', 'subscriptions',
  'insurance', 'healthcare', 'entertainment', 'other'
);

create table public.income_sources (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  frequency income_frequency not null default 'monthly',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category expense_category not null,
  label text,
  amount numeric(12, 2) not null check (amount >= 0), -- normalized monthly amount
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index income_sources_user_id_idx on public.income_sources (user_id);
create index expenses_user_id_idx on public.expenses (user_id);
