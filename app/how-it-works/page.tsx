import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { FileUp, ScanSearch, ListChecks, DownloadCloud } from "lucide-react";

export const metadata: Metadata = {
  title: "How it works",
  description: "The four-step pipeline behind every LedgerFlow conversion.",
};

const steps = [
  {
    icon: FileUp,
    title: "Upload",
    body: "Drag in a bank statement PDF. It's validated immediately — file type, size, and whether the file is a genuine, unlocked PDF.",
  },
  {
    icon: ScanSearch,
    title: "Analyze",
    body: "The document is read, the bank is detected with a confidence score, and every transaction is extracted into a normalized structure.",
  },
  {
    icon: ListChecks,
    title: "Review",
    body: "You see every transaction before anything is exported. Rows the system isn't confident about are flagged so you can check or correct them.",
  },
  {
    icon: DownloadCloud,
    title: "Export",
    body: "Pick a destination format and generate the file. CSV, Excel, and JSON are ready today; the rest are in active beta.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <h1 className="font-display text-[2.4rem] tracking-tight text-ink">How it works</h1>
            <p className="mt-3 text-ink-soft">
              Every converter — CSV, Excel, QuickBooks, or otherwise — runs
              the same four-step pipeline. Only the last step changes.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-5 py-14">
          <div className="flex flex-col gap-10">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ledger-tint text-ledger-strong">
                    <s.icon size={19} />
                  </div>
                  {i < steps.length - 1 && <div className="mt-2 h-full w-px flex-1 bg-rule" />}
                </div>
                <div className="pb-6">
                  <h2 className="font-display text-xl text-ink">{s.title}</h2>
                  <p className="mt-1.5 max-w-[56ch] text-sm leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <ButtonLink href="/tools" size="lg" className="mt-4">
            Try it now
          </ButtonLink>
        </section>
      </main>
      <Footer />
    </>
  );
}
