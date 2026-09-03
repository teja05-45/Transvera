import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  { h: "1. The service", p: "LedgerFlow AI is a free beta product that converts financial statement PDFs into structured export files. Features may change, break, or be temporarily unavailable during beta." },
  { h: "2. Your content", p: "You retain ownership of the documents you upload and the data extracted from them. You're responsible for having the right to upload any document you submit." },
  { h: "3. Acceptable use", p: "Don't upload documents you don't have the right to process, attempt to disrupt the service, or use it to build a competing product from our output structure." },
  { h: "4. No payment obligations", p: "The product is free during beta. There is no payment functionality, billing, or subscription of any kind." },
  { h: "5. Accuracy disclaimer", p: "Extracted and exported data may contain errors. You are responsible for reviewing transactions before relying on any exported file for accounting, tax, or financial decisions." },
  { h: "6. Availability", p: "As a beta product, uptime and feature availability are not guaranteed." },
  { h: "7. Termination", p: "You may stop using the service and delete your account at any time. We may suspend accounts that violate acceptable use." },
  { h: "8. Changes", p: "These terms may be updated as the product develops. Material changes will be noted here." },
];

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="This is a placeholder structure covering the key sections a full terms-of-service document needs. It should be reviewed by counsel before this product handles real user data at scale."
    >
      <div className="flex flex-col gap-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="font-medium text-ink">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.p}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
