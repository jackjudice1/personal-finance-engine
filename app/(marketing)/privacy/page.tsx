import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const LAST_UPDATED = "July 21, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Summit (&quot;we,&quot; &quot;us&quot;) is an independently operated project, not a bank, broker-dealer, or registered
          investment adviser. This policy explains what information Summit collects, how it&apos;s used, and how
          it&apos;s protected.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Account info: your email address and password (handled by our authentication provider, Supabase).</li>
            <li>
              Financial info you enter yourself: income sources, expenses, assets, liabilities, goals, and stock
              holdings. We never connect to your bank or brokerage accounts today — everything is manually entered.
            </li>
            <li>Basic usage analytics (pages visited) via Vercel Analytics, used only in aggregate.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">How we use it</h2>
          <p>
            Solely to power Summit&apos;s features for you: your Financial Health Score, recommendations, net worth
            tracking, simulators, and the AI Financial Coach. We do not sell your data, use it for advertising, or
            share it with third parties for marketing purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">Who else sees it</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-foreground">Supabase</strong> hosts our database and handles authentication.
              Your financial data is stored there.
            </li>
            <li>
              <strong className="text-foreground">Finnhub</strong> powers stock quotes and market news. Only public
              ticker symbols and news categories are sent to Finnhub — never your income, balances, or any other
              personal financial data.
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> hosts the site and provides basic, aggregate
              traffic analytics.
            </li>
            <li>The AI Financial Coach runs entirely on our own servers — no chat content is sent to any external AI provider.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">How your data is protected</h2>
          <p>
            Every table in our database uses row-level security, enforced by the database itself: the code only
            ever runs queries scoped to your own account, so other users cannot read your data through the app. Data
            is encrypted in transit (HTTPS) and at rest by our hosting provider. As with any hosted application, the
            operator of Summit retains administrative access to the underlying database — this policy commits to
            never using that access to view your data except to fix a bug you&apos;ve reported or as required by
            law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">Your choices</h2>
          <p>
            You can edit or delete any financial info you&apos;ve entered directly in the app at any time. To
            request full account deletion, email us at{" "}
            <a href="mailto:[insert contact email]" className="underline underline-offset-4">
              [insert contact email]
            </a>{" "}
            and we&apos;ll remove your account and associated data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">Children&apos;s privacy</h2>
          <p>Summit is not directed at children under 13, and we do not knowingly collect their information.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">Changes to this policy</h2>
          <p>
            If this policy changes materially, we&apos;ll update the date at the top of this page. Continued use of
            Summit after a change means you accept the updated policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-foreground">Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href="mailto:[insert contact email]" className="underline underline-offset-4">
              [insert contact email]
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
