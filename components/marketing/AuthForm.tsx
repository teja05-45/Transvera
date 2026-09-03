"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDemoSession } from "@/lib/demo-session";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { login } = useDemoSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    login({ name: name || email.split("@")[0], email });
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3 rounded-[var(--radius-md)] border border-rule bg-paper p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-ink-soft" />
        <p className="text-xs leading-relaxed text-ink-soft">
          This preview build isn&apos;t connected to a real authentication
          backend. Continuing creates a local demo session in your browser
          only — no account is created on a server, and no password is
          stored or checked.
        </p>
      </div>

      {mode === "signup" && (
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-ledger"
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-ledger"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="mt-1.5 w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised px-3.5 py-2.5 text-sm text-ink focus:border-ledger"
        />
      </div>

      <Button type="submit" size="lg" className="mt-1">
        {mode === "login" ? "Log in" : "Create account"}
      </Button>

      <button
        type="button"
        onClick={() => {
          login({ name: "Demo User", email: "demo@ledgerflow.example" });
          router.push("/dashboard");
        }}
        className="rounded-[var(--radius-md)] border border-rule px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-ink-soft hover:text-ink"
      >
        Continue with Google (demo)
      </button>

      <p className="text-center text-sm text-ink-faint">
        {mode === "login" ? (
          <>
            No account? <Link href="/signup" className="text-ledger-strong">Sign up</Link>
          </>
        ) : (
          <>
            Already have one? <Link href="/login" className="text-ledger-strong">Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}
