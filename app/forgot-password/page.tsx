"use client";

import { useState } from "react";
import { PageShell } from "@/components/marketing/PageShell";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell title="Reset your password" intro="Enter your email and we'll send a reset link.">
      {sent ? (
        <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-ledger/40 bg-ledger-tint/50 p-5">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ledger-strong" />
          <p className="text-sm text-ink">
            If an account exists for that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ledger"
          />
          <Button type="submit" size="lg" className="self-start">
            Send reset link
          </Button>
          <p className="text-xs text-ink-faint">
            This preview build has no email delivery configured, so no email
            actually sends yet — the form and validation are real.
          </p>
        </form>
      )}
    </PageShell>
  );
}
