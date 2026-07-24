"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { useIncomeSources } from "@/hooks/useIncomeSources";
import { useExpenses } from "@/hooks/useExpenses";
import { useAssets } from "@/hooks/useAssets";
import {
  EXPENSE_CATEGORY_LABELS,
  ASSET_TYPE_LABELS,
  INCOME_TYPE_LABELS,
  INCOME_FREQUENCY_LABELS,
  INCOME_FREQUENCY_NOUN,
  toNetAmount,
} from "@/types/financial";
import type { IncomeSource } from "@/types/financial";
import type { IncomeFrequency, IncomeType } from "@/types/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function IncomeRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: IncomeSource;
  onUpdate: (updates: Partial<{ label: string; amount: number; frequency: IncomeFrequency; type: IncomeType; deductionRate: number | null }>) => void;
  onDelete: () => void;
}) {
  const [label, setLabel] = useState(item.label);
  const [amount, setAmount] = useState(item.amount);
  const [rate, setRate] = useState<number | null>(item.deductionRate);

  return (
    <div className="space-y-2 rounded-lg border border-border/60 p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Source</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => label !== item.label && onUpdate({ label })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select value={item.type} onValueChange={(v) => onUpdate({ type: v as IncomeType })}>
              <SelectTrigger className="w-full">
                <SelectValue>{(value: string) => INCOME_TYPE_LABELS[value as keyof typeof INCOME_TYPE_LABELS]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INCOME_TYPE_LABELS).map(([value, l]) => (
                  <SelectItem key={value} value={value}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <Input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              onBlur={() => amount !== item.amount && onUpdate({ amount })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Frequency</Label>
            <Select value={item.frequency} onValueChange={(v) => onUpdate({ frequency: v as IncomeFrequency })}>
              <SelectTrigger className="w-full">
                <SelectValue>{(value: string) => INCOME_FREQUENCY_LABELS[value as keyof typeof INCOME_FREQUENCY_LABELS]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INCOME_FREQUENCY_LABELS).map(([value, l]) => (
                  <SelectItem key={value} value={value}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label="Remove" className="mt-5">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor={`deduction-${item.id}`} className="shrink-0 text-xs text-muted-foreground">
          Est. tax/deductions %
        </Label>
        <Input
          id={`deduction-${item.id}`}
          type="number"
          step="1"
          min={0}
          max={100}
          placeholder="Optional"
          className="w-24"
          value={rate ?? ""}
          onChange={(e) => setRate(e.target.value === "" ? null : Number(e.target.value))}
          onBlur={() => rate !== item.deductionRate && onUpdate({ deductionRate: rate })}
        />
        {rate ? (
          <p className="text-xs text-muted-foreground">
            ≈ <span className="font-medium text-foreground">{formatCurrency(toNetAmount(item.amount, rate))}</span> net /{" "}
            {INCOME_FREQUENCY_NOUN[item.frequency]}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Leave blank if this is already your take-home pay.</p>
        )}
      </div>
    </div>
  );
}

function IncomeSection() {
  const { items, isLoading, add, remove, update } = useIncomeSources();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [frequency, setFrequency] = useState<IncomeFrequency>("monthly");
  const [type, setType] = useState<IncomeType>("salary_wage");
  const [deductionRate, setDeductionRate] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income</CardTitle>
        <CardDescription>
          Every source of income, normalized to monthly. Add an estimated tax/deduction % to factor in take-home pay
          instead of gross.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-16" />
        ) : (
          items.map((i) => (
            <IncomeRow key={i.id} item={i} onDelete={() => remove(i.id)} onUpdate={(updates) => update(i.id, updates)} />
          ))
        )}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Input placeholder="Source" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Select value={type} onValueChange={(v) => setType(v as IncomeType)}>
            <SelectTrigger className="w-full">
              <SelectValue>{(value: string) => INCOME_TYPE_LABELS[value as keyof typeof INCOME_TYPE_LABELS]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INCOME_TYPE_LABELS).map(([value, l]) => (
                <SelectItem key={value} value={value}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Amount" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
          <Select value={frequency} onValueChange={(v) => setFrequency(v as IncomeFrequency)}>
            <SelectTrigger className="w-full">
              <SelectValue>{(value: string) => INCOME_FREQUENCY_LABELS[value as keyof typeof INCOME_FREQUENCY_LABELS]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INCOME_FREQUENCY_LABELS).map(([value, l]) => (
                <SelectItem key={value} value={value}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Tax % (optional)"
            min={0}
            max={100}
            value={deductionRate ?? ""}
            onChange={(e) => setDeductionRate(e.target.value === "" ? null : Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (label && amount > 0) {
                add(label, amount, frequency, type, deductionRate);
                setLabel("");
                setAmount(0);
                setFrequency("monthly");
                setType("salary_wage");
                setDeductionRate(null);
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
