"use client";

import Link from "next/link";
import { Plus, RefreshCw, TrendingUp } from "lucide-react";
import { useStockHoldings } from "@/hooks/useStockHoldings";
import { PortfolioSummaryCard } from "@/components/investing/PortfolioSummaryCard";
import { HoldingsTable } from "@/components/investing/HoldingsTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestingPage() {
  const { holdings, isLoading, deleteHolding, refreshPrices } = useStockHoldings();

  const totalCostBasis = holdings.reduce((sum, h) => sum + h.shares * h.costBasisPerShare, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * (h.lastPrice ?? h.costBasisPerShare), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Investing</h1>
          <p className="text-sm text-muted-foreground">Your positions, priced with real market data.</p>
        </div>
        <div className="flex items-center gap-2">
          {holdings.length > 0 && (
            <Button variant="outline" onClick={() => refreshPrices()}>
              <RefreshCw className="size-4" />
              Refresh prices
            </Button>
          )}
          <Button nativeButton={false} render={<Link href="/dashboard/investing/new" />}>
            <Plus className="size-4" />
            Add position
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="col-span-full h-56" />
        </div>
      ) : holdings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 p-12 text-center">
          <TrendingUp className="size-8 text-muted-foreground" />
          <p className="font-medium">No positions yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add a stock you own and we&apos;ll track its real-time value alongside your other goals.
          </p>
          <Button className="mt-2" nativeButton={false} render={<Link href="/dashboard/investing/new" />}>
            <Plus className="size-4" />
            Add your first position
          </Button>
        </div>
      ) : (
        <>
          <PortfolioSummaryCard totalCostBasis={totalCostBasis} totalValue={totalValue} />
          <HoldingsTable holdings={holdings} onDelete={deleteHolding} />
        </>
      )}
    </div>
  );
}
