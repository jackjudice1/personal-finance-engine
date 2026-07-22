-- Debt Freedom Countdown needs to know how much of a debt has been paid off,
-- which requires the balance it started at - not tracked until now. Backfill
-- existing debts to their current balance: there's no way to recover their
-- true original balance, so progress tracking for pre-existing debts starts
-- from today rather than from whenever they were actually opened.
alter table public.liabilities
  add column original_balance numeric(14, 2) not null default 0;

update public.liabilities set original_balance = balance;
