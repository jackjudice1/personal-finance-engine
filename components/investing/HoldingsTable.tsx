"use client";

import { Trash2 } from "lucide-react";
import type { StockHolding } from "@/types/financial";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { cn } from "@/lib/utils";

export function HoldingsTable({
  holdings,
  onDelete,
}: {
  holdings: StockHolding[];
  onDelete: (holdingId: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Ticker</th>
            <th className="px-4 py-2.5 font-medium">Shares</th>
            <th className="px-4 py-2.5 font-medium">Cost basis</th>
            <th className="px-4 py-2.5 font-medium">Current price</th>
            <th className="px-4 py-2.5 font-medium">Market value</th>
            <th className="px-4 py-2.5 font-medium">Gain/loss</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const price = holding.lastPrice ?? holding.costBasisPerShare;
            const marketValue = holding.shares * price;
            const costBasisTotal = holding.shares * holding.costBasisPerShare;
            const gain = marketValue - costBasisTotal;
            const gainPercent = costBasisTotal > 0 ? gain / costBasisTotal : 0;
            const isPositive = gain >= 0;

            return (
              <tr key={holding.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{holding.ticker}</div>
                  {holding.companyName && (
                    <div className="text-xs text-muted-foreground">{holding.companyName}</div>
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums">{holding.shares}</td>
                <td className="px-4 py-3 tabular-nums">{formatCurrency(holding.costBasisPerShare, true)}</td>
                <td className="px-4 py-3 tabular-nums">
                  {holding.lastPrice !== null ? (
                    formatCurrency(holding.lastPrice, true)
                  ) : (
                    <span className="text-xs text-muted-foreground">Not priced yet</span>
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums">{formatCurrency(marketValue)}</td>
                <td className={cn("px-4 py-3 tabular-nums", isPositive ? "text-primary" : "text-destructive")}>
                  {isPositive ? "+" : ""}
                  {formatCurrency(gain)} ({isPositive ? "+" : ""}
                  {formatPercent(gainPercent, 1)})
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => onDelete(holding.id)} aria-label="Remove position">
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
