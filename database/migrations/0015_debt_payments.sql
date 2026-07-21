-- Payment history for debts, one row per logged payment. Stores the
-- resulting balance directly (balance_after) rather than deriving it by
-- walking backward from the current balance - the latter breaks the moment
-- a user directly edits a liability's balance outside of a payment (which
-- is allowed), since that edit would silently shift every historical chart
-- point instead of just the point at the time of the edit.
create table public.debt_payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  liability_id uuid not null references public.liabilities(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  balance_after numeric(12, 2) not null check (balance_after >= 0),
  paid_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index debt_payments_liability_id_idx on public.debt_payments (liability_id, paid_at);
create index debt_payments_user_id_idx on public.debt_payments (user_id);

alter table public.debt_payments enable row level security;
create policy "debt_payments_select_own" on public.debt_payments for select using (auth.uid() = user_id);
create policy "debt_payments_insert_own" on public.debt_payments for insert with check (auth.uid() = user_id);
-- Deliberately no update/delete policy: the balance decrease and the payment
-- record must change together or not at all, and a plain client-side delete
-- here would remove the history without reversing the balance already
-- applied by log_debt_payment. No "undo" in this pass.

-- Atomically logs a payment and decreases the liability's balance, so the
-- two can never drift apart from a partial failure. `for update` row-locks
-- the liability during the read-modify-write so two rapid submits can't
-- both read the same starting balance.
create or replace function public.log_debt_payment(
  p_liability_id uuid,
  p_amount numeric,
  p_paid_at date default current_date
)
returns public.liabilities
language plpgsql
security definer
set search_path = public
as $$
declare
  v_liability public.liabilities;
begin
  if p_amount <= 0 then
    raise exception 'Payment amount must be positive';
  end if;

  select * into v_liability from public.liabilities
    where id = p_liability_id and user_id = auth.uid()
    for update;

  if not found then
    raise exception 'Liability not found or not owned by caller';
  end if;

  update public.liabilities
    set balance = greatest(balance - p_amount, 0)
    where id = p_liability_id
    returning * into v_liability;

  insert into public.debt_payments (user_id, liability_id, amount, balance_after, paid_at)
  values (auth.uid(), p_liability_id, p_amount, v_liability.balance, p_paid_at);

  return v_liability;
end;
$$;
