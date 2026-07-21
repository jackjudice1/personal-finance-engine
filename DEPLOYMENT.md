# Deployment

Push to GitHub → connect to Vercel → the site goes live. Custom domain can be attached whenever you're ready.

## 1. Push to GitHub

```bash
git init                      # if not already a repo
git add .
git commit -m "Initial commit"
gh repo create personal-finance-decision-engine --private --source=. --push
# or create the repo on github.com and:
#   git remote add origin <your-repo-url>
#   git push -u origin main
```

## 2. Set up Supabase (if you haven't)

Follow **[`database/README.md`](database/README.md)** — create a project, run the migrations, and note your project URL + anon key + service role key. You'll need these for step 4.

## 3. Import the project into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: Next.js (auto-detected).
3. Leave build settings as default (`npm run build`).

## 4. Environment variables

In the Vercel project's **Settings → Environment Variables**, add everything from `.env.example` that you're using:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | From Supabase Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server-only) | Never expose to the client; used for future Stripe webhook writes |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Your production URL, e.g. `https://yourdomain.com` — used in sitemap/robots |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID` | Not yet | Leave blank until Stripe billing is wired up (see `lib/stripe/`) |
| `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` | Not yet | Leave blank until Plaid is wired up (see `lib/plaid/`) |
| `OPENAI_API_KEY` | Not yet | Leave blank until the AI assistant is upgraded from rule-based (see `lib/ai/assistant.ts`) |

Set these for the **Production**, **Preview**, and **Development** environments as appropriate.

## 5. Configure Supabase Auth redirect URLs

In your Supabase project, go to **Authentication → URL Configuration** and add your Vercel production URL (and any preview URLs you want to support) to the allowed redirect URLs, e.g.:

```
https://your-app.vercel.app/**
https://yourdomain.com/**
```

This is required for email confirmation and password reset links to work after deployment.

## 6. Deploy

Click **Deploy**. Vercel builds and serves the app — every push to `main` redeploys production, and every PR gets a preview deployment.

## 7. Custom domain

In **Settings → Domains**, add your domain and follow Vercel's DNS instructions. Update `NEXT_PUBLIC_SITE_URL` (and the Supabase redirect URLs above) to match once it's live.

## Verifying the deployment

- Visit the deployed URL — the landing page should render (works even without Supabase configured).
- Sign up for an account — this exercises the full Supabase Auth + onboarding flow.
- Complete onboarding and confirm the dashboard shows your Financial Health Score, net worth, and recommendations.

## Post-launch: enabling real billing/bank data/AI

This app ships with clean seams for three integrations that aren't active yet:

- **Stripe** (`lib/stripe/`) — install the `stripe` package, implement `getStripeClient()`, and fill in the handlers in `lib/stripe/webhookHandlers.ts` + `app/api/stripe/webhook/route.ts`.
- **Plaid** (`lib/plaid/`) — install the `plaid` package and implement the functions in `lib/plaid/client.ts`.
- **OpenAI** (`lib/ai/assistant.ts`) — swap the internals of `answerQuestion()` for a real LLM call; the call site (`app/api/assistant/route.ts`) doesn't need to change.
