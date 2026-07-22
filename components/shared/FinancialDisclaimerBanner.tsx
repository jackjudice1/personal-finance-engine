import Link from "next/link";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FinancialDisclaimerBanner() {
  return (
    <Alert>
      <Info />
      <AlertDescription>
        Educational and rule-based, generated from the numbers you enter — not financial, investment, tax, or legal
        advice. Summora Systems is not a registered investment adviser. See our{" "}
        <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
      </AlertDescription>
    </Alert>
  );
}
