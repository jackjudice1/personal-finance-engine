-- Optional local dev seed data. Run manually against a Supabase project
-- AFTER creating at least one user via /signup, then substitute that user's
-- id (from auth.users) for :user_id below.
--
--   psql "$DATABASE_URL" -v user_id="'00000000-0000-0000-0000-000000000000'" -f database/seed.sql

insert into public.income_sources (user_id, label, amount, frequency, is_primary) values
  (:user_id, 'Salary', 6200, 'monthly', true),
  (:user_id, 'Freelance', 400, 'monthly', false);

insert into public.expenses (user_id, category, label, amount) values
  (:user_id, 'housing', 'Rent', 1900),
  (:user_id, 'transportation', 'Car + gas', 350),
  (:user_id, 'food', 'Groceries + dining', 650),
  (:user_id, 'subscriptions', 'Streaming + software', 85),
  (:user_id, 'insurance', 'Renters + health', 220),
  (:user_id, 'entertainment', 'Fun money', 200);

insert into public.assets (user_id, type, label, balance, interest_rate, is_emergency_fund) values
  (:user_id, 'savings', 'Emergency fund', 4500, 4.2, true),
  (:user_id, 'checking', 'Checking', 1800, 0, false),
  (:user_id, 'investment', 'Brokerage (index funds)', 12500, null, false),
  (:user_id, 'retirement', '401(k)', 21000, null, false);

insert into public.liabilities (user_id, type, label, balance, interest_rate, minimum_payment) values
  (:user_id, 'credit_card', 'Visa', 3200, 22.99, 90),
  (:user_id, 'student_loan', 'Federal loan', 18500, 5.5, 210);

insert into public.goals (user_id, type, title, target_amount, current_amount, target_date, monthly_contribution, priority) values
  (:user_id, 'emergency_fund', 'Fully funded emergency fund', 15000, 4500, current_date + interval '10 months', 1050, 1),
  (:user_id, 'debt_freedom', 'Pay off credit card', 3200, 0, current_date + interval '8 months', 400, 1),
  (:user_id, 'home_purchase', 'House down payment', 60000, 8000, current_date + interval '3 years', 1200, 3);
