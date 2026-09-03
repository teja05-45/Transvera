"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fileRows } from "@/lib/dashboard-demo-data";
import { demoTransactions } from "@/lib/demo-data";
import { TransactionTable } from "@/components/converter/TransactionTable";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

export default function FileDetailPage() {
  const params = useParams<{ id: string }>();
  const file = fileRows.find((f) => f.id === params.id);
  const [transactions, setTransactions] = useState(demoTransactions);

  if (!file) return notFound();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-2xl text-ink">{file.filename}</h1>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Bank", file.bank],
            ["Currency", file.currency],
            ["Period", file.period],
            ["Pages", String(file.pages)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-4">
              <p className="text-xs text-ink-faint">{label}</p>
              <p className="mt-1 font-mono text-sm text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg text-ink">Transactions</h2>
          <div className="flex gap-2">
            <ButtonLink href="/tools/bank-statement-to-csv" variant="secondary" size="sm">
              Export
            </ButtonLink>
          </div>
        </div>
        <div className="mt-4">
          <TransactionTable transactions={transactions} onChange={setTransactions} />
        </div>
      </div>
    </DashboardShell>
  );
}
