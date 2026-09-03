import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/Badge";
import { converters } from "@/data/converters";
import { ArrowUpRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Converters",
  description:
    "Convert bank statement PDFs to CSV, Excel, JSON, QuickBooks, Xero, OFX, Google Sheets, Tally, Zoho Books, or FreshBooks.",
};

const categories = ["All", "Spreadsheet", "Accounting", "Developer", "Banking", "Productivity"] as const;

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h1 className="font-display text-[2.4rem] tracking-tight text-ink">Converters</h1>
            <p className="mt-3 max-w-[56ch] text-ink-soft">
              Every converter runs the same extraction engine on your
              statement — only the output format changes. Pick one to start.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-rule px-3.5 py-1.5 text-sm text-ink-soft"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {converters.map((c) => (
              <Link
                key={c.slug}
                href={`/tools/${c.slug}`}
                className="group flex flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6 shadow-[var(--shadow-card)] transition-colors hover:border-ledger"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-[var(--radius-sm)] bg-rule/50 px-2 py-1 font-mono text-xs text-ink-soft">
                      {c.category}
                    </span>
                    {c.maturity === "beta" && <Badge tone="gold">Beta</Badge>}
                  </div>
                  <h2 className="mt-3 font-display text-xl text-ink">{c.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {c.shortDescription}
                  </p>
                  <p className="mt-3 text-xs text-ink-faint">Best for: {c.bestFor}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
                  Convert
                  <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}

            <Link
              href="/tools/credit-card-statement-categorizer"
              className="flex flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-dashed border-rule-strong bg-paper p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-[var(--radius-sm)] bg-rule/50 px-2 py-1 font-mono text-xs text-ink-soft">
                    Productivity
                  </span>
                  <Badge tone="neutral">
                    <Clock size={12} /> Coming soon
                  </Badge>
                </div>
                <h2 className="mt-3 font-display text-xl text-ink">Credit Card Categorizer</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Upload a credit card statement and get transactions
                  automatically sorted into spending categories.
                </p>
              </div>
              <span className="text-sm font-medium text-ink-faint">Preview the plan</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
