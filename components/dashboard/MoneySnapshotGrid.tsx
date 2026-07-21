import { Banknote, PiggyBank, Receipt, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { MoneySnapshotCard } from "@/components/dashboard/MoneySnapshotCard";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import type { FinancialProfile } from "@/types/financial";

export function MoneySnapshotGrid({ profile }: { profile: FinancialProfile }) {
  const items = [
    {
      icon: Wallet,
      label: "Monthly Income",
      value: formatCurrency(profile.monthlyIncome),
      description: "All your income sources added up and normalized to a monthly amount, whatever frequency you entered them as.",
    },
    {
      icon: Receipt,
      label: "Monthly Expenses",
      value: formatCurrency(profile.monthlyExpenses),
      description: "Your monthly spending added up across every category you entered in onboarding.",
    },
    {
      icon: TrendingUp,
      label: "Savings Rate",
      value: formatPercent(profile.savingsRate),
      description: "(Income − Expenses) ÷ Income. The share of what you earn that you're not spending. A very high rate usually means either low expenses or income that's higher than what you actually take home — worth double-checking your entered numbers if this looks off.",
    },
    {
      icon: Banknote,
      label: "Debt Remaining",
      value: formatCurrency(profile.totalLiabilities),
      description: "The total balance across every liability you've added — credit cards, loans, mortgage, etc.",
    },
    {
      icon: PiggyBank,
      label: "Investment Balance",
      value: formatCurrency(profile.totalInvestmentAssets),
      description: "The total balance in accounts you marked as type \"Investment\" or \"Retirement.\" Cash in savings/checking doesn't count here.",
    },
    {
      icon: ShieldCheck,
      label: "Emergency Fund",
      value: formatCurrency(profile.emergencyFundBalance),
      description: "The total balance in accounts you specifically flagged as your emergency fund during onboarding (or in Settings).",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <MoneySnapshotCard key={item.label} {...item} />
      ))}
    </div>
  );
}
