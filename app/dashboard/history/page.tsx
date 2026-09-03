"use client";

import { useMemo, useState } from "react";
import { Search, Download, RotateCcw, Trash2, Eye } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { BackendRequiredBanner } from "@/components/dashboard/BackendRequiredBanner";
import { historyRows } from "@/lib/dashboard-demo-data";

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(historyRows);

  const filtered = useMemo(
    () => rows.filter((r) => `${r.document} ${r.bank} ${r.format}`.toLowerCase().includes(query.toLowerCase())),
    [rows, query]
  );

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-2xl text-ink">History</h1>
        <div className="mt-6">
          <BackendRequiredBanner feature="Conversion history" />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search history"
              className="w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-ledger"
            />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule text-left text-xs text-ink-faint">
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Bank</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Format</th>
                <th className="px-4 py-3 font-medium">Transactions</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-rule/70 last:border-0">
                  <td className="px-4 py-3 text-ink">{r.document}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.bank}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.date}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.format}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.transactions || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "rounded-full px-2.5 py-1 text-xs font-medium " +
                        (r.status === "Completed" ? "bg-ledger-tint text-ledger-strong" : "bg-error-tint text-error")
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-ink-faint">
                      <button aria-label="View" className="hover:text-ink"><Eye size={14} /></button>
                      <button aria-label="Download" className="hover:text-ink"><Download size={14} /></button>
                      <button aria-label="Convert again" className="hover:text-ink"><RotateCcw size={14} /></button>
                      <button
                        aria-label="Delete"
                        className="hover:text-error"
                        onClick={() => setRows((prev) => prev.filter((row) => row.id !== r.id))}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-ink-faint">
                    No conversions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
