import type { Metadata } from "next";
import { Users, FileStack, RefreshCcw, ListTodo, Landmark, AlertOctagon } from "lucide-react";
import { BackendRequiredBanner } from "@/components/dashboard/BackendRequiredBanner";
import { historyRows } from "@/lib/dashboard-demo-data";

export const metadata: Metadata = { title: "Admin" };

const stats = [
  { label: "Total users", value: "1", icon: Users },
  { label: "Documents", value: "5", icon: FileStack },
  { label: "Transactions", value: "89", icon: ListTodo },
  { label: "Conversions", value: "5", icon: RefreshCcw },
  { label: "Failed jobs", value: "1", icon: AlertOctagon },
  { label: "Registered banks", value: "3", icon: Landmark },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl text-ink">Admin</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Users, documents, jobs, and the bank registry, in one place.
      </p>
      <div className="mt-6">
        <BackendRequiredBanner feature="The admin panel" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
            <s.icon size={16} className="text-ink-faint" />
            <p className="mt-2 font-display text-xl text-ink">{s.value}</p>
            <p className="text-xs text-ink-faint">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg text-ink">Recent jobs</h2>
        <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule text-left text-xs text-ink-faint">
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Bank</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((r) => (
                <tr key={r.id} className="border-b border-rule/70 last:border-0">
                  <td className="px-4 py-3 text-ink">{r.document}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.bank}</td>
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
                  <td className="px-4 py-3 text-ink-soft">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
