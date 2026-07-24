import type { Database } from "@/types/database.types";
import type { Asset, Expense, FinancialProfile, Goal, IncomeSource, Liability, StockHolding } from "@/types/financial";
import { toMonthlyAmount, toNetAmount } from "@/types/financial";

type IncomeRow = Database["public"]["Tables"]["income_sources"]["Row"];
type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];
type AssetRow = Database["public"]["Tables"]["assets"]["Row"];
type LiabilityRow = Database["public"]["Tables"]["liabilities"]["Row"];
type GoalRow = Database["public"]["Tables"]["goals"]["Row"];
type StockHoldingRow = Database["public"]["Tables"]["stock_holdings"]["Row"];

export interface RawFinancialData {
  userId: string;
  incomeSources: IncomeRow[];
  expenses: ExpenseRow[];
  assets: AssetRow[];
  liabilities: LiabilityRow[];
  goals: GoalRow[];
  stockHoldings: StockHoldingRow[];
}

/**
 * Transforms raw Supabase rows into the normalized FinancialProfile shape
 * every lib/engine and lib/simulators function consumes. This is the one
 * place that knows about DB row shapes vs. domain types.
 */
export function buildFinancialProfile(raw: RawFinancialData): FinancialProfile {
  const incomeSources: IncomeSource[] = raw.incomeSources.map((row) => ({
    id: row.id,
    label: row.label,
    amount: Number(row.amount),
    frequency: row.frequency,
    isPrimary: row.is_primary,
    deductionRate: row.deduction_rate == null ? null : Number(row.deduction_rate),
  }));

  const expenses: Expense[] = raw.expenses.map((row) => ({
    id: row.id,
    category: row.category,
    label: row.label,
    amount: Number(row.amount),
  }));

  const assets: Asset[] = raw.assets.map((row) => ({
    id: row.id,
    type: row.type,
    label: row.label,
    balance: Number(row.balance),
    interestRate: row.interest_rate === null ? null : Number(row.interest_rate),
    isEmergencyFund: row.is_emergency_fund,
  }));

  const liabilities: Liability[] = raw.liabilities.map((row) => ({
    id: row.id,
    type: row.type,
    label: row.label,
    balance: Number(row.balance),
    originalBalance: Number(row.original_balance),
    interestRate: Number(row.interest_rate),
    minimumPayment: Number(row.minimum_payment ?? 0),
  }));

  const goals: Goal[] = raw.goals.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    targetDate: row.target_date,
    monthlyContribution: Number(row.monthly_contribution ?? 0),
    priority: row.priority,
    status: row.status,
  }));

  const stockHoldings: StockHolding[] = raw.stockHoldings.map((row) => ({
    id: row.id,
    ticker: row.ticker,
    companyName: row.company_name,
    shares: Number(row.shares),
    costBasisPerShare: Number(row.cost_basis_per_share),
    lastPrice: row.last_price === null ? null : Number(row.last_price),
    lastPriceFetchedAt: row.last_price_fetched_at,
  }));

  const monthlyIncome = incomeSources.reduce(
    (sum, s) => sum + toMonthlyAmount(toNetAmount(s.amount, s.deductionRate), s.frequency),
    0
  );
  const monthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    },
    {} as FinancialProfile["expensesByCategory"]
  );

  const totalStockHoldingsCostBasis = stockHoldings.reduce((sum, h) => sum + h.shares * h.costBasisPerShare, 0);
  // Falls back to cost basis for a position that hasn't had its first price
  // refresh yet (see hooks/useStockHoldings.ts) rather than counting it as $0.
  const totalStockHoldingsValue = stockHoldings.reduce(
    (sum, h) => sum + h.shares * (h.lastPrice ?? h.costBasisPerShare),
    0
  );

  const genericAssetTotal = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalAssets = genericAssetTotal + totalStockHoldingsValue;
  const genericInvestmentAssetTotal = assets
    .filter((a) => a.type === "investment" || a.type === "retirement")
    .reduce((sum, a) => sum + a.balance, 0);
  const totalInvestmentAssets = genericInvestmentAssetTotal + totalStockHoldingsValue;
  const emergencyFundBalance = assets.filter((a) => a.isEmergencyFund).reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
  const totalMinimumPayments = liabilities.reduce((sum, l) => sum + l.minimumPayment, 0);

  const savingsRate = monthlyIncome > 0 ? Math.max(0, (monthlyIncome - monthlyExpenses) / monthlyIncome) : 0;

  return {
    userId: raw.userId,
    incomeSources,
    monthlyIncome,
    expenses,
    monthlyExpenses,
    expensesByCategory,
    assets,
    totalAssets,
    totalInvestmentAssets,
    emergencyFundBalance,
    liabilities,
    totalLiabilities,
    totalMinimumPayments,
    goals,
    stockHoldings,
    totalStockHoldingsCostBasis,
    totalStockHoldingsValue,
    savingsRate,
  };
}
