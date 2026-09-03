import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    h: "1. What we collect",
    p: "Account details you provide (name, email), documents you upload, data extracted from those documents, and basic usage data (pages visited, actions taken) needed to operate the product.",
  },
  {
    h: "2. How we use it",
    p: "To process the documents you upload, generate the exports you request, maintain your conversion history, and improve reliability. We do not sell your data.",
  },
  {
    h: "3. Document retention",
    p: "Uploaded documents and derived transaction data are kept until you delete them. You can delete individual documents from Files, or delete your account and all associated data from Settings.",
  },
  {
    h: "4. Third-party processing",
    p: "Where a feature integrates with a third-party service you connect (for example, Google for Sheets export), data is shared with that service only for the action you request.",
  },
  {
    h: "5. Security",
    p: "See the Security page for a description of how documents and account data are protected.",
  },
  {
    h: "6. Your rights",
    p: "You may request a copy of your data or its deletion at any time by contacting us or using the controls in Settings.",
  },
  {
    h: "7. Changes to this policy",
    p: "If this policy changes materially, we'll note it here and, where practical, notify account holders.",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This is a placeholder structure covering the key sections a full privacy policy needs. It should be reviewed by counsel before this product handles real user data at scale."
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
