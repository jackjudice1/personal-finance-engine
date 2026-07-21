create type simulation_type as enum ('can_i_afford_this', 'debt_vs_investing', 'what_if');

create table public.simulations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type simulation_type not null,
  inputs jsonb not null,
  outputs jsonb not null,
  created_at timestamptz not null default now()
);

create index simulations_user_id_idx on public.simulations (user_id, created_at desc);
