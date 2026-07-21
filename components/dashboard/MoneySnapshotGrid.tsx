import { Banknote, PiggyBank, Receipt, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { MoneySnapshotCard } from "@/components/dashboard/MoneySnapshotCard";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import type { FinancialProfile } from "@/types/financial";

export function MoneySnapshotGrid({ profile }: { profile: FinancialProfile }) {
  const items = [
    { icon: Wallet, label: "Monthly Income", value: formatCurrency(profile.monthlyIncome) },
    { icon: Receipt, label: "Monthly Expenses", value: formatCurrency(profile.monthlyExpenses) },
    { icon: TrendingUp, label: "Savings Rate", value: formatPercent(profile.savingsRate) },
    { icon: Banknote, label: "Debt Remaining", value: formatCurrency(profile.totalLiabilities) },
    { icon: PiggyBank, label: "Investment Balance", value: formatCurrency(profile.totalInvestmentAssets) },
    { icon: ShieldCheck, label: "Emergency Fund", value: formatCurrency(profile.emergencyFundBalance) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <MoneySnapshotCard key={item.label} {...item} />
      ))}
    </div>
  );
}
