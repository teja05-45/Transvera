"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { BackendRequiredBanner } from "@/components/dashboard/BackendRequiredBanner";
import { ButtonLink } from "@/components/ui/Button";
import { historyRows } from "@/lib/dashboard-demo-data";
import { useDemoSession } from "@/lib/demo-session";

const stats = [
  { label: "Documents processed", value: "5" },
  { label: "Transactions extracted", value: "89" },
  { label: "Exports generated", value: "5" },
];

export default function DashboardPage() {
  const { user } = useDemoSession();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-ink-faint">Welcome back{user ? `, ${user.name}` : ""}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-ink">Dashboard</h1>
          <ButtonLink href="/tools" size="md">
            New conversion
          </ButtonLink>
        </div>

        <div className="mt-6">
          <BackendRequiredBanner feature="The dashboard" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
              <p className="text-xs text-ink-faint">{s.label}</p>
              <p className="mt-1.5 font-display text-2xl text-ink">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="font-display text-lg text-ink">Recent conversions</h2>
          <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-xs text-ink-faint">
                  <th className="px-4 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">Format</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.slice(0, 4).map((r) => (
                  <tr key={r.id} className="border-b border-rule/70 last:border-0">
                    <td className="px-4 py-3 text-ink">{r.document}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.format}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.date}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
