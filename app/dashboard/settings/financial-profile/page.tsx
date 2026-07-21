"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { useIncomeSources } from "@/hooks/useIncomeSources";
import { useExpenses } from "@/hooks/useExpenses";
import { useAssets } from "@/hooks/useAssets";
import { EXPENSE_CATEGORY_LABELS, ASSET_TYPE_LABELS } from "@/types/financial";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";

function Row({ label, sub, onDelete }: { label: string; sub: string; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label="Remove">
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function IncomeSection() {
  const { items, isLoading, add, remove } = useIncomeSources();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income</CardTitle>
        <CardDescription>Every source of income, normalized to monthly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-16" />
        ) : (
          items.map((i) => (
            <Row key={i.id} label={i.label} sub={`${formatCurrency(i.amount)} / ${i.frequency}`} onDelete={() => remove(i.id)} />
          ))
        )}
        <div className="flex gap-2">
          <Input placeholder="Source" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Input type="number" placeholder="Amount" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (label && amount > 0) {
                add(label, amount, "monthly");
                setLabel("");
                setAmount(0);
              }
            }}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpensesSection() {
  const { items, isLoading, add, remove } = useExpenses();
  const [category, setCategory] = useState<keyof typeof EXPENSE_CATEGORY_LABELS>("other");
  const [amount, setAmount] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>Monthly spending by category.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-16" />
        ) : (
          items.map((e) => (
            <Row
              key={e.id}
              label={EXPENSE_CATEGORY_LABELS[e.category]}
              sub={formatCurrency(e.amount)}
              onDelete={() => remove(e.id)}
            />
          ))
        )}
        <div className="flex gap-2">
          <Select value={category} onValueChange={(v) => setCategory(v as keyof typeof EXPENSE_CATEGORY_LABELS)}>
            <SelectTrigger className="w-40">
              <SelectValue>
                {(value: string) => EXPENSE_CATEGORY_LABELS[value as keyof typeof EXPENSE_CATEGORY_LABELS]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, l]) => (
                <SelectItem key={value} value={value}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Amount" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (amount > 0) {
                add(category, amount);
                setAmount(0);
              }
            }}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AssetsSection() {
  const { items, isLoading, add, remove } = useAssets();
  const [type, setType] = useState<keyof typeof ASSET_TYPE_LABELS>("savings");
  const [label, setLabel] = useState("");
  const [balance, setBalance] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>Savings, investments, retirement, property.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-16" />
        ) : (
          items.map((a) => (
            <Row
              key={a.id}
              label={a.label}
              sub={`${formatCurrency(a.balance)}${a.isEmergencyFund ? " • Emergency fund" : ""}`}
              onDelete={() => remove(a.id)}
            />
          ))
        )}
        <div className="flex flex-wrap gap-2">
          <Select value={type} onValueChange={(v) => setType(v as keyof typeof ASSET_TYPE_LABELS)}>
            <SelectTrigger className="w-36">
              <SelectValue>{(value: string) => ASSET_TYPE_LABELS[value as keyof typeof ASSET_TYPE_LABELS]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ASSET_TYPE_LABELS).map(([value, l]) => (
                <SelectItem key={value} value={value}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Name" className="w-28" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Input type="number" placeholder="Balance" className="w-28" value={balance || ""} onChange={(e) => setBalance(Number(e.target.value))} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (label && balance >= 0) {
                add(type, label, balance, false);
                setLabel("");
                setBalance(0);
              }
            }}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancialProfilePage() {
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Financial profile</h1>
        <p className="text-sm text-muted-foreground">Edit the raw numbers behind your dashboard and recommendations.</p>
      </div>
      <IncomeSection />
      <ExpensesSection />
      <AssetsSection />
      <Link
        href="/dashboard/debts"
        className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm transition-colors hover:border-primary/50"
      >
        <span>
          <span className="font-medium">Looking for debts?</span>{" "}
          <span className="text-muted-foreground">They now have their own tab, with payment tracking.</span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </div>
  );
}
