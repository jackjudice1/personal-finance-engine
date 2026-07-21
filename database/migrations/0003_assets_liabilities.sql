create type asset_type as enum (
  'savings', 'checking', 'investment', 'retirement', 'real_estate', 'other'
);
create type liability_type as enum (
  'credit_card', 'student_loan', 'auto_loan', 'mortgage', 'personal_loan', 'other'
);

create table public.assets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type asset_type not null,
  label text not null,
  balance numeric(14, 2) not null default 0 check (balance >= 0),
  interest_rate numeric(5, 2), -- APY, nullable (e.g. checking accounts)
  is_emergency_fund boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.liabilities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type liability_type not null,
  label text not null,
  balance numeric(14, 2) not null default 0 check (balance >= 0),
  interest_rate numeric(5, 2) not null default 0,
  minimum_payment numeric(12, 2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assets_user_id_idx on public.assets (user_id);
create index liabilities_user_id_idx on public.liabilities (user_id);
