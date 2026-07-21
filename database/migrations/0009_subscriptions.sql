-- Stripe-shaped from day one so wiring real billing later is additive, not a
-- schema migration. All Stripe fields are nullable and unused until then.
create type subscription_tier as enum ('free', 'premium');
create type subscription_status as enum (
  'active', 'trialing', 'past_due', 'canceled', 'incomplete', 'none'
);

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier subscription_tier not null default 'free',
  status subscription_status not null default 'none',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Give every new user a free-tier subscription row so `usePremiumGate()`
-- never has to special-case a missing row.
create or replace function public.handle_new_user_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row execute procedure public.handle_new_user_subscription();
