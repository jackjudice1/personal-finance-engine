import { getTimeRemaining } from "@/lib/simulators/debtPayoff";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-accent px-3 py-2">
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function DebtCountdown({ debtFreeDate }: { debtFreeDate: string | null }) {
  if (!debtFreeDate) {
    return (
      <p className="text-sm text-muted-foreground">
        At your current payments, this debt won&apos;t pay itself off — the minimum payments don&apos;t cover the interest. Try
        the extra-payment simulator to find an amount that does.
      </p>
    );
  }

  const { years, months, days } = getTimeRemaining(new Date(debtFreeDate));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <CountdownUnit value={years} label={years === 1 ? "Year" : "Years"} />
        <CountdownUnit value={months} label={months === 1 ? "Month" : "Months"} />
        <CountdownUnit value={days} label={days === 1 ? "Day" : "Days"} />
      </div>
      <p className="text-center text-xs text-muted-foreground">until financial freedom</p>
    </div>
  );
}
