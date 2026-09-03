"use client";

import { useMemo, useState } from "react";
import { Search, Trash2, Undo2 } from "lucide-react";
import type { NormalizedTransaction } from "@/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "needs-review" | "high-confidence" | "debit" | "credit";

interface Props {
  transactions: NormalizedTransaction[];
  onChange: (transactions: NormalizedTransaction[]) => void;
}

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs-review", label: "Needs review" },
  { id: "high-confidence", label: "High confidence" },
  { id: "debit", label: "Debit" },
  { id: "credit", label: "Credit" },
];

const money = (v: number | null) => (v === null ? "" : v.toFixed(2));

export function TransactionTable({ transactions, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [deletedRow, setDeletedRow] = useState<{ row: NormalizedTransaction; index: number } | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filter === "needs-review" && !t.needsReview) return false;
      if (filter === "high-confidence" && t.confidence < 0.9) return false;
      if (filter === "debit" && t.debit === null) return false;
      if (filter === "credit" && t.credit === null) return false;
      if (query && !`${t.description} ${t.reference}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [transactions, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);

  function updateRow(id: string, patch: Partial<NormalizedTransaction>) {
    onChange(transactions.map((t) => (t.id === id ? { ...t, ...patch, needsReview: false } : t)));
  }

  function deleteRow(id: string) {
    const index = transactions.findIndex((t) => t.id === id);
    const row = transactions[index];
    setDeletedRow({ row, index });
    onChange(transactions.filter((t) => t.id !== id));
  }

  function undoDelete() {
    if (!deletedRow) return;
    const next = [...transactions];
    next.splice(deletedRow.index, 0, deletedRow.row);
    onChange(next);
    setDeletedRow(null);
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised">
      <div className="flex flex-col gap-3 border-b border-rule p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search description or reference"
            className="w-full rounded-[var(--radius-md)] border border-rule bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-ledger"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilter(f.id);
                setPage(0);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.id ? "bg-ink text-paper" : "bg-rule/50 text-ink-soft hover:bg-rule"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {deletedRow && (
        <div className="flex items-center justify-between gap-3 border-b border-rule bg-warning-tint/60 px-4 py-2.5 text-sm text-ink">
          <span>Transaction deleted.</span>
          <button onClick={undoDelete} className="inline-flex items-center gap-1.5 font-medium text-warning">
            <Undo2 size={14} /> Undo
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-rule text-left text-xs text-ink-faint">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 text-right font-medium">Debit</th>
              <th className="px-4 py-3 text-right font-medium">Credit</th>
              <th className="px-4 py-3 text-right font-medium">Balance</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="w-9 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((t) => (
              <tr
                key={t.id}
                className={cn(
                  "border-b border-rule/70 last:border-0",
                  t.needsReview && "bg-warning-tint/40"
                )}
              >
                <td className="px-4 py-2.5 font-mono text-xs text-ink-soft">{t.date}</td>
                <td className="px-4 py-2.5">
                  <input
                    value={t.description}
                    onChange={(e) => updateRow(t.id, { description: e.target.value })}
                    className="w-full min-w-[180px] rounded-[var(--radius-sm)] border border-transparent bg-transparent px-1.5 py-1 text-ink hover:border-rule focus:border-ledger"
                  />
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-ink-soft">{t.reference}</td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-ink">
                  {money(t.debit)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-ledger-strong">
                  {money(t.credit)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-ink-soft">
                  {money(t.balance)}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      t.confidence >= 0.9
                        ? "bg-ledger-tint text-ledger-strong"
                        : "bg-warning-tint text-warning"
                    )}
                  >
                    {Math.round(t.confidence * 100)}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => deleteRow(t.id)}
                    aria-label="Delete transaction"
                    className="text-ink-faint hover:text-error"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-ink-faint">
                  No transactions match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-rule px-4 py-3 text-xs text-ink-faint">
        <span>
          {filtered.length} of {transactions.length} transactions
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-[var(--radius-sm)] px-2 py-1 hover:bg-rule/50 disabled:opacity-30"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {pageCount}
          </span>
          <button
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="rounded-[var(--radius-sm)] px-2 py-1 hover:bg-rule/50 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
