import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function TrustSection() {
  const categories = ["Accounting", "Bookkeeping", "Finance", "Tax", "Data analysis", "Operations"];
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
          Built for
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {categories.map((c) => (
            <span key={c} className="font-display text-lg text-ink-soft">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const benefits = [
  { title: "Less manual entry", body: "Stop retyping statements line by line into a spreadsheet." },
  { title: "Structure preserved", body: "Dates, references, and running balances stay intact and reconciled." },
  { title: "Review before export", body: "Nothing leaves LedgerFlow until you've confirmed it's right." },
  { title: "Multiple output formats", body: "One extraction, ten possible destinations." },
  { title: "Bulk processing", body: "Convert a batch of statements in one pass instead of one at a time." },
  { title: "Searchable history", body: "Come back to any past conversion and re-download or re-export it." },
];

export function Benefits() {
  return (
    <section className="border-b border-rule bg-paper-raised">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-[2rem] tracking-tight text-ink">Why LedgerFlow</h2>
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="border-l-2 border-ledger pl-4">
              <h3 className="font-medium text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const useCases = [
  { href: "/use-cases/accountants", title: "Accountants", body: "Turn client statements into workpapers in minutes, not hours." },
  { href: "/use-cases/bookkeepers", title: "Bookkeepers", body: "Reconcile faster with clean, structured transaction exports." },
  { href: "/use-cases/small-business", title: "Small businesses", body: "Get your own statements into a format your books understand." },
  { href: "/use-cases/finance-teams", title: "Finance teams", body: "Standardize statement data across accounts and entities." },
  { href: "/use-cases/tax-professionals", title: "Tax professionals", body: "Prepare transaction data for filing season without retyping." },
  { href: "/use-cases/data-analysts", title: "Data analysts", body: "Get statement data into JSON for your own pipelines." },
];

export function UseCasesSection() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-[2rem] tracking-tight text-ink">Who it&apos;s for</h2>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <Link key={u.href} href={u.href} className="bg-paper-raised p-6 hover:bg-ledger-tint/40">
              <h3 className="font-display text-lg text-ink">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{u.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SecuritySnapshot() {
  const points = [
    "Files are transmitted over HTTPS only.",
    "Uploaded documents are only accessible to your account.",
    "You can delete an uploaded document and its data at any time.",
    "Processing runs in isolated jobs, not shared between users.",
  ];
  return (
    <section className="border-b border-rule bg-paper-raised">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div>
            <h2 className="font-display text-[2rem] tracking-tight text-ink">Security</h2>
            <p className="mt-3 max-w-[42ch] text-ink-soft">
              A straightforward account of how your data is handled — see
              the full page for details.
            </p>
            <ButtonLink href="/security" variant="secondary" size="sm" className="mt-5">
              Read the security page
            </ButtonLink>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="rounded-[var(--radius-md)] border border-rule bg-paper p-4 text-sm text-ink-soft">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "What kind of PDFs can I upload?",
    a: "Bank and credit card statement PDFs. Both text-based PDFs and scanned statements are supported — scanned pages fall back to OCR automatically.",
  },
  {
    q: "Is my data accurate after conversion?",
    a: "You review every extracted transaction before exporting. Rows LedgerFlow isn't confident about are flagged so you can check or correct them.",
  },
  {
    q: "Which formats are fully working today?",
    a: "CSV, Excel, and JSON are generated and downloadable today. QuickBooks, Xero, OFX, Tally, Zoho Books, and FreshBooks exports are in beta while we validate output against each target system.",
  },
  {
    q: "Do I need an account to try it?",
    a: "No — you can try the full workflow with a sample statement without signing up. An account lets you save history and reuse past conversions.",
  },
  {
    q: "Is LedgerFlow free?",
    a: "Yes. The product is a free beta with no payment required for any feature.",
  },
];

export function FAQSection() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-display text-[2rem] tracking-tight text-ink">Frequently asked</h2>
        <div className="mt-8 divide-y divide-rule">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink">
                <span className="font-medium">{f.q}</span>
                <span className="shrink-0 text-ink-faint transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2.5 max-w-[64ch] text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
        <ButtonLink href="/faq" variant="secondary" size="sm" className="mt-8">
          View the full FAQ
        </ButtonLink>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 sm:flex-row sm:items-center">
        <h2 className="max-w-[24ch] font-display text-[1.9rem] leading-tight tracking-tight text-paper">
          Turn your next statement into structured data.
        </h2>
        <ButtonLink href="/tools" size="lg" className="bg-paper text-ink hover:bg-ledger-tint shrink-0">
          Start converting
        </ButtonLink>
      </div>
    </section>
  );
}
