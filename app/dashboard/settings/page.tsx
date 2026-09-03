"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { BackendRequiredBanner } from "@/components/dashboard/BackendRequiredBanner";
import { useDemoSession } from "@/lib/demo-session";
import { Button } from "@/components/ui/Button";

const tabs = ["Profile", "Security", "Preferences", "Data & Privacy"] as const;

export default function SettingsPage() {
  const { user } = useDemoSession();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Profile");

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-2xl text-ink">Settings</h1>
        <div className="mt-6">
          <BackendRequiredBanner feature="Account settings" />
        </div>

        <div className="mt-6 flex gap-1 border-b border-rule">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "border-b-2 px-3 py-2.5 text-sm font-medium transition-colors " +
                (tab === t ? "border-ink text-ink" : "border-transparent text-ink-faint hover:text-ink")
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Profile" && (
            <div className="flex flex-col gap-4 max-w-sm">
              <Field label="Name" defaultValue={user?.name ?? ""} />
              <Field label="Email" defaultValue={user?.email ?? ""} type="email" />
              <Button className="self-start">Save changes</Button>
            </div>
          )}
          {tab === "Security" && (
            <div className="flex flex-col gap-4 max-w-sm">
              <Field label="Current password" type="password" />
              <Field label="New password" type="password" />
              <Button className="self-start">Update password</Button>
              <div className="mt-4 rounded-[var(--radius-md)] border border-rule p-4">
                <p className="text-sm text-ink">Connected accounts</p>
                <p className="mt-1 text-xs text-ink-faint">No accounts connected.</p>
              </div>
            </div>
          )}
          {tab === "Preferences" && (
            <div className="flex flex-col gap-3 text-sm text-ink-soft">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Email me when a conversion finishes
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Default export format: Excel
              </label>
            </div>
          )}
          {tab === "Data & Privacy" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-[var(--radius-md)] border border-rule p-4">
                <p className="text-sm font-medium text-ink">Delete uploaded data</p>
                <p className="mt-1 text-sm text-ink-soft">Removes all uploaded documents and extracted transactions.</p>
                <Button variant="secondary" size="sm" className="mt-3">Delete uploaded data</Button>
              </div>
              <div className="rounded-[var(--radius-md)] border border-error/40 bg-error-tint/40 p-4">
                <p className="text-sm font-medium text-error">Delete account</p>
                <p className="mt-1 text-sm text-ink-soft">Permanently deletes your account and all associated data.</p>
                <Button size="sm" className="mt-3 bg-error hover:bg-error">Delete account</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function Field({ label, defaultValue = "", type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-ledger"
      />
    </div>
  );
}
