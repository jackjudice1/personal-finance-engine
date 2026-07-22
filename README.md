# Summora Systems

A financial operating system that answers *"What is the smartest financial decision I can make next?"* — not another budgeting app that shows you where your money went, but a decision engine that tells you what to do next.

## Features

- **Financial Health Score** — a 0–100 composite score (cash flow, debt, savings, investment sub-scores)
- **Decision Engine** — rule-based recommendation cards grounded in your real numbers
- **Net worth tracker** — assets vs. liabilities, with a daily-snapshot trend chart
- **Debts** — editable debt list with payment logging and a payoff projection chart
- **Investing** — holdings tracking with live quotes and portfolio summary
- **News** — personalized market news feed
- **Goals** — house, debt freedom, retirement, etc., each with progress, timeline, and required monthly pace
- **Simulators** — Can I Afford This?, Debt vs. Investing, and a What-If projection tool
- **Gamification** — levels (Beginner → Financial Master) and achievements
- **AI Assistant** — chat interface answering questions like "Can I afford a Tesla?", grounded in your actual data (rule-based today, designed to swap in a real LLM later — see [`lib/ai/assistant.ts`](lib/ai/assistant.ts))
- **Monetization architecture** — Free/Premium tiers with Stripe-shaped schema, ready to wire up real billing

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-ui primitives)
- **Backend**: Supabase (Postgres + Auth via `@supabase/ssr`)
- **Charts**: Recharts
- **Forms/validation**: react-hook-form + zod
- **Future integrations (architecturally wired, not yet active)**: Stripe (`lib/stripe/`), Plaid (`lib/plaid/`), OpenAI (`lib/ai/assistant.ts`)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

This app needs a Supabase project for auth and data storage. See **[`database/README.md`](database/README.md)** for full setup and migration instructions. In short:

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your project URL + keys
3. Run the SQL files in `database/migrations/` (in order) via the Supabase SQL editor

Without this step, auth-gated pages (`/onboarding`, `/dashboard`) redirect to `/login` with a message rather than crashing — the landing page, pricing, and auth pages still work.

### 3. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build       # production build
npm run start       # run the production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

## Project structure

```
app/                  Next.js App Router routes
  (marketing)/         Landing page, /pricing
  (auth)/              /login /signup /reset-password
  onboarding/          Guided multi-step financial onboarding
  dashboard/           Authenticated app: health score, goals, simulators, assistant, settings
  api/                 Route handlers (onboarding completion, assistant, simulations, Stripe webhook stub)
components/           React components, grouped by feature area
lib/
  supabase/            Browser/server/middleware Supabase clients
  engine/              Health score, recommendations, net worth, goal projections, levels (pure functions)
  simulators/          Can I Afford This / Debt vs Investing / What-If (pure functions)
  ai/                  Rule-based assistant — the seam for a future LLM swap
  stripe/, plaid/      Stubs for future billing/bank integrations
  validations/         zod schemas
  constants/           Achievements, levels, personality-mode copy
hooks/                 Client-side data hooks (financial profile, goals, achievements, etc.)
database/              SQL migrations + setup README
types/                 Shared TypeScript types
```

## Deployment

See **[`DEPLOYMENT.md`](DEPLOYMENT.md)** for pushing to GitHub and deploying on Vercel.

## Disclaimer

Recommendations are educational and rule-based, generated from the numbers you provide. This is not a registered investment advisor and does not constitute financial advice.
