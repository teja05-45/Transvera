import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Credit Card Statement Categorizer",
  description: "Coming soon: automatic category detection for credit card transactions.",
};

const categories = [
  "Dining", "Travel", "Utilities", "Shopping", "Software", "Entertainment",
  "Transportation", "Healthcare", "Insurance", "Taxes", "Fees", "Transfers", "Other",
];

export default function CategorizerPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <Badge tone="neutral">
              <Clock size={12} /> Coming soon
            </Badge>
            <h1 className="mt-4 font-display text-[2.2rem] tracking-tight text-ink sm:text-[2.6rem]">
              Credit Card Statement Categorizer
            </h1>
            <p className="mt-4 max-w-[60ch] text-ink-soft">
              Upload a credit card statement, and each transaction will be
              automatically sorted into a spending category — with a
              confidence score and the ability to correct anything that&apos;s
              off. This isn&apos;t live yet; here&apos;s the plan.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-14">
          <h2 className="font-display text-xl text-ink">Planned workflow</h2>
          <ol className="mt-4 flex flex-col gap-2 text-sm text-ink-soft">
            <li>1. Upload a credit card statement PDF</li>
            <li>2. Transactions are extracted the same way as any bank statement</li>
            <li>3. Each transaction is automatically categorized</li>
            <li>4. You review category, confidence, merchant, and amount per row</li>
            <li>5. Correct anything mis-categorized, then export</li>
          </ol>

          <h2 className="mt-10 font-display text-xl text-ink">Planned categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c} className="rounded-full border border-rule px-3 py-1.5 text-sm text-ink-soft">
                {c}
              </span>
            ))}
          </div>

          <p className="mt-10 max-w-[60ch] text-sm text-ink-faint">
            We won&apos;t mark this feature as available until automatic
            categorization has been validated against real statements. Want
            to be notified when it launches?
          </p>
          <ButtonLink href="/contact" variant="secondary" size="md" className="mt-4">
            Get notified
          </ButtonLink>
        </section>
      </main>
      <Footer />
    </>
  );
}
