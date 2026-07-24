-- Optional estimated tax/deduction percentage per income source, so a gross
-- salary (e.g. entered as "$60,000 annually") can be converted to a net
-- figure for the financial profile instead of being treated as fully
-- disposable income. Null preserves existing behavior exactly - the amount
-- is used as-is with no deduction applied.
alter table public.income_sources
  add column deduction_rate numeric(5, 2)
    check (deduction_rate is null or (deduction_rate >= 0 and deduction_rate <= 100));
