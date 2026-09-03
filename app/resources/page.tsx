import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { articles } from "@/data/resources";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides on converting and importing bank statement data into your accounting workflow.",
};

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <h1 className="font-display text-[2.4rem] tracking-tight text-ink">Resources</h1>
            <p className="mt-3 text-ink-soft">
              Guides on turning statement PDFs into usable data across
              different accounting workflows.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-5 py-14">
          <div className="flex flex-col divide-y divide-rule">
            {articles.map((a) => (
              <Link key={a.slug} href={`/resources/${a.slug}`} className="group flex items-start justify-between gap-6 py-6">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-ledger">{a.category}</span>
                  <h2 className="mt-1.5 font-display text-lg text-ink">{a.title}</h2>
                  <p className="mt-1.5 max-w-[56ch] text-sm text-ink-soft">{a.summary}</p>
                  <p className="mt-2 text-xs text-ink-faint">{a.readMinutes} min read</p>
                </div>
                <ArrowUpRight size={17} className="mt-1 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
