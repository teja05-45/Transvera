import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { BulkWorkspace } from "@/components/converter/BulkWorkspace";

export const metadata: Metadata = {
  title: "Bulk Conversion",
  description: "Convert multiple bank statement PDFs in one batch.",
};

export default function BulkPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-4xl px-5 py-12">
            <h1 className="font-display text-[2.2rem] tracking-tight text-ink sm:text-[2.6rem]">
              Bulk conversion
            </h1>
            <p className="mt-3 max-w-[62ch] text-ink-soft">
              Upload several statements at once. Each is processed
              independently — one failed document won&apos;t stop the rest of
              the batch — and you can download results individually or
              combined.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-5 py-12">
          <BulkWorkspace />
        </section>
      </main>
      <Footer />
    </>
  );
}
