create type goal_type as enum (
  'debt_freedom', 'emergency_fund', 'home_purchase', 'car_purchase',
  'vacation', 'retirement', 'invest_more', 'business', 'custom'
);

create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type goal_type not null,
  title text not null,
  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0 check (current_amount >= 0),
  target_date date,
  monthly_contribution numeric(12, 2) default 0,
  priority smallint not null default 3 check (priority between 1 and 5), -- 1 = highest
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index goals_user_id_idx on public.goals (user_id);
