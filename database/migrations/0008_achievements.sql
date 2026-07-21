create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null, -- matches lib/constants/achievements.ts id
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_key)
);

create table public.user_levels (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_level text not null default 'beginner'
    check (current_level in ('beginner', 'saver', 'investor', 'wealth_builder', 'financial_master')),
  updated_at timestamptz not null default now()
);

create index achievements_user_id_idx on public.achievements (user_id);
