"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const navLinks = [
  { href: "/tools", label: "Converters" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/use-cases/accountants", label: "Solutions" },
  { href: "/resources", label: "Resources" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="font-display text-[1.15rem] tracking-tight text-ink">
            LedgerFlow <span className="text-ledger">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.925rem] text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-[0.925rem] text-ink-soft hover:text-ink">
            Log in
          </Link>
          <ButtonLink href="/tools" size="sm">
            Start converting
          </ButtonLink>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-rule bg-paper px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-2 py-2.5 text-[0.95rem] text-ink-soft hover:bg-rule/40 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-rule pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-[0.95rem] text-ink-soft"
              >
                Log in
              </Link>
              <ButtonLink href="/tools" size="md" className="justify-center">
                Start converting
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="26" height="28" rx="3" fill="var(--ink)" />
      <path d="M9 10H23" stroke="var(--paper)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 15H19" stroke="var(--paper)" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M9 22.5L13.2 26.5L23 15"
        stroke="var(--ledger)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
