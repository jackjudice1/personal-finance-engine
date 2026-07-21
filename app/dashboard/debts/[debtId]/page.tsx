"use client";

import { useParams } from "next/navigation";
import { useDebts } from "@/hooks/useDebts";
import { useDebtPaymentHistory } from "@/hooks/useDebtPaymentHistory";
import { DebtDetailPanel } from "@/components/debts/DebtDetailPanel";
import { Skeleton } from "@/components/ui/skeleton";
import type { DebtFormInput } from "@/lib/validations/debts";

export default function DebtDetailPage() {
  const params = useParams<{ debtId: string }>();
  const { debts, isLoading, updateDebt, deleteDebt, refetch } = useDebts();
  const debt = debts.find((d) => d.id === params.debtId) ?? null;
  const { history, isLoading: isHistoryLoading, logPayment } = useDebtPaymentHistory(debt?.id ?? null, refetch);

  if (isLoading || isHistoryLoading) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (!debt) {
    return <p className="text-sm text-muted-foreground">Debt not found.</p>;
  }

  async function handleUpdate(values: DebtFormInput) {
    await updateDebt(debt!.id, values);
  }

  async function handleDelete() {
    await deleteDebt(debt!.id);
  }

  return (
    <DebtDetailPanel debt={debt} history={history} onUpdate={handleUpdate} onLogPayment={logPayment} onDelete={handleDelete} />
  );
}
