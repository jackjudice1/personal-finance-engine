"use client";

import { useRouter } from "next/navigation";
import { useStockHoldings } from "@/hooks/useStockHoldings";
import { AddHoldingForm } from "@/components/investing/AddHoldingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockHoldingFormInput } from "@/lib/validations/stockHoldings";

export default function NewHoldingPage() {
  const router = useRouter();
  const { createHolding } = useStockHoldings();

  async function handleSubmit(values: StockHoldingFormInput) {
    await createHolding(values);
    router.push("/dashboard/investing");
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Add a position</CardTitle>
      </CardHeader>
      <CardContent>
        <AddHoldingForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
