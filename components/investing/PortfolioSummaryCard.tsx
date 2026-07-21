import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { cn } from "@/lib/utils";

export function PortfolioSummaryCard({
  totalCostBasis,
  totalValue,
}: {
  totalCostBasis: number;
  totalValue: number;
}) {
  const gain = totalValue - totalCostBasis;
  const gainPercent = totalCostBasis > 0 ? gain / totalCostBasis : 0;
  const isPositive = gain >= 0;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card>
        <CardContent>
          <p className="text-xs text-muted-foreground">Total invested</p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrency(totalCostBasis)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p className="text-xs text-muted-foreground">Current value</p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrency(totalValue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p className="text-xs text-muted-foreground">Total gain/loss</p>
          <p className={cn("text-lg font-semibold tabular-nums", isPositive ? "text-primary" : "text-destructive")}>
            {isPositive ? "+" : ""}
            {formatCurrency(gain)}{" "}
            <span className="text-sm font-medium">
              ({isPositive ? "+" : ""}
              {formatPercent(gainPercent, 1)})
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
