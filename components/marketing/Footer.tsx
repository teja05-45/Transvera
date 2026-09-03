import Link from "next/link";
import { LogoMark } from "./Navbar";
import { converters } from "@/data/converters";

const columns: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Converters",
    links: converters.slice(0, 6).map((c) => ({ href: `/tools/${c.slug}`, label: c.name })),
  },
  {
    title: "Solutions",
    links: [
      { href: "/use-cases/accountants", label: "Accountants" },
      { href: "/use-cases/bookkeepers", label: "Bookkeepers" },
      { href: "/use-cases/small-business", label: "Small business" },
      { href: "/use-cases/finance-teams", label: "Finance teams" },
      { href: "/use-cases/tax-professionals", label: "Tax professionals" },
      { href: "/use-cases/data-analysts", label: "Data analysts" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/resources", label: "Resources" },
      { href: "/faq", label: "FAQ" },
      { href: "/security", label: "Security" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <LogoMark size={22} />
              <span className="font-display text-[1.05rem] text-ink">LedgerFlow AI</span>
            </div>
            <p className="mt-3 max-w-[26ch] text-sm text-ink-soft">
              Turn financial documents into usable data. Free during beta.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-medium text-ink">{col.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} LedgerFlow AI. Free beta — no payment required.</span>
          <span>Not affiliated with any bank, QuickBooks, Xero, Tally, Zoho, or FreshBooks.</span>
        </div>
      </div>
    </footer>
  );
}
