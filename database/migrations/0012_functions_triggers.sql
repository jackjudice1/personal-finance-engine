-- Generic updated_at maintenance, attached to every table that has the column.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.income_sources
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.expenses
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.assets
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.liabilities
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.goals
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.user_levels
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

-- Convenience function: one round trip to fetch a user's full financial
-- profile as JSON, instead of 5+ separate queries. Optional fast path --
-- lib/engine consumers can also compose the individual table queries.
create or replace function public.get_financial_profile(p_user_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'income_sources', coalesce((select jsonb_agg(t) from public.income_sources t where t.user_id = p_user_id), '[]'::jsonb),
    'expenses', coalesce((select jsonb_agg(t) from public.expenses t where t.user_id = p_user_id), '[]'::jsonb),
    'assets', coalesce((select jsonb_agg(t) from public.assets t where t.user_id = p_user_id), '[]'::jsonb),
    'liabilities', coalesce((select jsonb_agg(t) from public.liabilities t where t.user_id = p_user_id), '[]'::jsonb),
    'goals', coalesce((select jsonb_agg(t) from public.goals t where t.user_id = p_user_id and t.status = 'active'), '[]'::jsonb)
  );
$$ language sql stable security definer set search_path = public;
