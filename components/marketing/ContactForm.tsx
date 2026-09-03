"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-ledger/40 bg-ledger-tint/50 p-5">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ledger-strong" />
        <div>
          <p className="text-sm font-medium text-ink">Message sent.</p>
          <p className="mt-1 text-sm text-ink-soft">We&apos;ll get back to you by email.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot field, hidden from real users */}
      <input
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Subject" name="subject" required />
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="mt-1.5 w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ledger"
        />
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-error">
          {errorMsg}
        </p>
      )}
      <Button type="submit" disabled={status === "sending"} className="self-start">
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-[var(--radius-md)] border border-rule bg-paper-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ledger"
      />
    </div>
  );
}
