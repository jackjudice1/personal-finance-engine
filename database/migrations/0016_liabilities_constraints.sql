-- Closes a data-integrity gap found in a security review: liabilities
-- shipped with a balance >= 0 check but no bounds on interest_rate or
-- minimum_payment, unlike the newer stock_holdings/debt_payments tables.
-- App-level validation (lib/validations/debts.ts, lib/validations/
-- onboarding.ts) already enforces these same bounds, so this just adds
-- database-level defense in depth against a client that bypasses the form.
--
-- Clamp any existing out-of-range values first so the constraint can be
-- added safely regardless of current data.
update public.liabilities set interest_rate = 0 where interest_rate < 0;
update public.liabilities set interest_rate = 100 where interest_rate > 100;
update public.liabilities set minimum_payment = 0 where minimum_payment < 0;

alter table public.liabilities
  add constraint liabilities_interest_rate_range check (interest_rate >= 0 and interest_rate <= 100);

alter table public.liabilities
  add constraint liabilities_minimum_payment_nonnegative check (minimum_payment >= 0);
