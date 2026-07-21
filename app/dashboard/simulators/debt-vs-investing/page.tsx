import { DebtVsInvestingChart } from "@/components/simulators/DebtVsInvestingChart";

export default function DebtVsInvestingPage() {
  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Debt vs. Investing</h1>
        <p className="text-sm text-muted-foreground">
          Compare putting extra money toward debt versus investing it, over time.
        </p>
      </div>
      <DebtVsInvestingChart />
    </div>
  );
}
