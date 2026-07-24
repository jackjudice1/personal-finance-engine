-- Income type categories, mirroring how expenses/assets/liabilities are
-- already categorized (a fixed enum "type" plus a free-text "label").
create type income_type as enum ('salary_wage', 'commission', 'tips_bonuses', 'freelance', 'passive_income', 'other');

alter table public.income_sources
  add column type income_type not null default 'salary_wage';

-- Additional pay frequencies. Hourly/daily require a standard-week assumption
-- to normalize to monthly (see toMonthlyAmount in types/financial.ts) - the
-- app discloses that assumption directly in the frequency picker's label.
-- Semi-monthly (paid twice a month, e.g. the 1st and 15th - 24 payments/year)
-- is distinct from biweekly (every two weeks - 26 payments/year).
alter type income_frequency add value 'hourly';
alter type income_frequency add value 'daily';
alter type income_frequency add value 'semi_monthly';
