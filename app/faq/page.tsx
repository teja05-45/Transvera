import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about supported PDFs, OCR, bank detection, formats, bulk conversion, and privacy.",
};

const groups: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: "Documents",
    items: [
      {
        q: "What PDFs are supported?",
        a: "Bank and credit card statement PDFs, whether they have a text layer or are scanned images. Scanned pages are handled through an OCR fallback.",
      },
      {
        q: "What happens with a password-protected PDF?",
        a: "Upload validation catches it before processing starts and asks you to remove the password and re-upload.",
      },
      {
        q: "Is there a file size limit?",
        a: "Yes, 20MB per file. Larger statements can usually be split into separate month files.",
      },
    ],
  },
  {
    heading: "Bank detection & accuracy",
    items: [
      {
        q: "How does bank detection work?",
        a: "Each supported bank has a dedicated parser. If the detected confidence is low, you're asked to confirm the bank manually before extraction continues.",
      },
      {
        q: "How accurate is transaction extraction?",
        a: "You review every transaction before export. Rows the system isn't confident about are flagged so you can check or correct them — we don't claim 100% accuracy on any statement.",
      },
    ],
  },
  {
    heading: "Formats",
    items: [
      {
        q: "Which formats work today?",
        a: "CSV, Excel, and JSON generate real downloadable files today.",
      },
      {
        q: "What about QuickBooks, Xero, OFX, Tally, Zoho Books, and FreshBooks?",
        a: "Those exporters are built on the same architecture but are marked beta until their output is validated against the real target systems.",
      },
    ],
  },
  {
    heading: "Bulk conversion",
    items: [
      {
        q: "Can I convert multiple statements at once?",
        a: "Yes, from the bulk conversion page. One failed document won't stop the rest of the batch.",
      },
    ],
  },
  {
    heading: "Privacy & data",
    items: [
      {
        q: "How long is my data kept?",
        a: "Uploaded documents and their extracted data remain until you delete them from your files or account settings.",
      },
      {
        q: "Can I delete my data?",
        a: "Yes — delete individual documents from Files, or delete your entire account and its data from Settings.",
      },
    ],
  },
  {
    heading: "Cost",
    items: [
      {
        q: "Is LedgerFlow free?",
        a: "Yes. It's a free beta with no payment functionality anywhere in the product.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PageShell eyebrow="Support" title="Frequently asked questions">
      <div className="flex flex-col gap-10">
        {groups.map((g) => (
          <div key={g.heading}>
            <h2 className="font-display text-xl text-ink">{g.heading}</h2>
            <div className="mt-4 divide-y divide-rule">
              {g.items.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink">
                    <span className="font-medium">{item.q}</span>
                    <span className="shrink-0 text-ink-faint transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
