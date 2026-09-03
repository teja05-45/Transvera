"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { BackendRequiredBanner } from "@/components/dashboard/BackendRequiredBanner";
import { fileRows } from "@/lib/dashboard-demo-data";
import { ButtonLink } from "@/components/ui/Button";

export default function FilesPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-ink">Files</h1>
          <ButtonLink href="/tools" size="sm">Upload a statement</ButtonLink>
        </div>
        <div className="mt-6">
          <BackendRequiredBanner feature="File management" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fileRows.map((f) => (
            <Link
              key={f.id}
              href={`/dashboard/files/${f.id}`}
              className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5 hover:border-ledger"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium text-ink">{f.filename}</p>
                <span
                  className={
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium " +
                    (f.status === "Ready" ? "bg-ledger-tint text-ledger-strong" : "bg-warning-tint text-warning")
                  }
                >
                  {f.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-ink-faint">{f.bank} · {f.currency}</p>
              <p className="mt-1 text-xs text-ink-faint">{f.period} · {f.pages} pages · {f.transactions} transactions</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
