import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pricing",
  description: "LedgerFlow AI is free during beta. No payment, no card required.",
};

const features = [
  "Bank statement PDF upload",
  "CSV export",
  "Excel export",
  "JSON export",
  "QuickBooks export (beta)",
  "Xero export (beta)",
  "OFX export (beta)",
  "Google Sheets workflow (beta)",
  "Tally export (beta)",
  "Zoho Books export (beta)",
  "FreshBooks export (beta)",
  "Bulk conversion",
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center">
            <h1 className="font-display text-[2.4rem] tracking-tight text-ink">Pricing</h1>
            <p className="mt-3 text-ink-soft">
              LedgerFlow AI is a free beta. Every feature below is available
              at no cost while we build toward a stable release.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-md px-5 py-16">
          <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-8 shadow-[var(--shadow-card)]">
            <p className="text-sm font-medium text-ledger">Free beta</p>
            <p className="mt-2 font-display text-[2.6rem] text-ink">$0</p>
            <p className="mt-1 text-sm text-ink-faint">No card required</p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <Check size={15} className="mt-0.5 shrink-0 text-ledger" />
                  {f}
                </li>
              ))}
            </ul>
            <ButtonLink href="/tools" size="lg" className="mt-8 w-full justify-center">
              Start converting
            </ButtonLink>
            <p className="mt-4 text-center text-xs text-ink-faint">
              No payment functionality exists in this product. Pricing may
              change after beta, and we&apos;ll tell you before it does.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
