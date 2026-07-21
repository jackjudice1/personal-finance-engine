"use client";

import { useRouter } from "next/navigation";
import { useDebts } from "@/hooks/useDebts";
import { DebtForm } from "@/components/debts/DebtForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DebtFormInput } from "@/lib/validations/debts";

export default function NewDebtPage() {
  const router = useRouter();
  const { createDebt } = useDebts();

  async function handleSubmit(values: DebtFormInput) {
    await createDebt(values);
    router.push("/dashboard/debts");
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Add a debt</CardTitle>
      </CardHeader>
      <CardContent>
        <DebtForm onSubmit={handleSubmit} submitLabel="Add debt" />
      </CardContent>
    </Card>
  );
}
