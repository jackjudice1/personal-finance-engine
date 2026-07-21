create type recommendation_category as enum (
  'debt', 'savings', 'investing', 'cash_flow', 'goal', 'general'
);
create type recommendation_severity as enum ('info', 'suggested', 'urgent');

create table public.recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_id text not null, -- maps to a rule function key, e.g. 'debt.payoff_before_invest'
  category recommendation_category not null,
  severity recommendation_severity not null default 'suggested',
  title text not null,
  description text not null,
  impact_amount numeric(14, 2),
  related_goal_id uuid references public.goals(id) on delete set null,
  is_dismissed boolean not null default false,
  generated_at timestamptz not null default now()
);

create index recommendations_user_id_idx on public.recommendations (user_id);
create index recommendations_active_idx on public.recommendations (user_id, is_dismissed, severity);
