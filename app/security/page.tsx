import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { Lock, ShieldCheck, KeyRound, Trash2, Server, ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Security",
  description: "How LedgerFlow AI handles your documents and data.",
};

const items = [
  {
    icon: Lock,
    title: "Encryption in transit",
    body: "All traffic to and from LedgerFlow is served over HTTPS. Uploaded files are never sent in the clear.",
  },
  {
    icon: KeyRound,
    title: "Authentication & authorization",
    body: "Access to your documents, transactions, and exports is tied to your account session. Every request is checked against the requesting user before data is returned.",
  },
  {
    icon: Server,
    title: "Isolated processing",
    body: "Each document is processed as its own job. Processing for one user's document doesn't share state with another's.",
  },
  {
    icon: Trash2,
    title: "Your data, your control",
    body: "You can delete an uploaded document — and everything derived from it — at any time from Files or Settings. Deleting your account deletes your data.",
  },
  {
    icon: ShieldCheck,
    title: "Input validation",
    body: "Uploads are checked for file type, size, and structural validity before they're processed, to keep malformed or unexpected files from reaching the processing pipeline.",
  },
  {
    icon: ScrollText,
    title: "Audit trail",
    body: "Account and document actions are logged internally so issues can be investigated.",
  },
];

export default function SecurityPage() {
  return (
    <PageShell
      eyebrow="Trust"
      title="Security"
      intro="A plain account of how LedgerFlow is built to protect your documents and data. We don't claim certifications we haven't earned — this page describes the architecture as it actually exists today."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
            <item.icon size={18} className="text-ledger" />
            <h2 className="mt-3 font-medium text-ink">{item.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-sm text-ink-faint">
        Found a security issue? Please{" "}
        <a href="/contact" className="text-ledger-strong underline underline-offset-2">
          contact us
        </a>{" "}
        directly rather than filing a public report.
      </p>
    </PageShell>
  );
}
