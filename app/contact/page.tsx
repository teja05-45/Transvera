import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Get in touch"
      title="Contact us"
      intro="Questions, bug reports, or feedback on the beta — send it our way."
    >
      <ContactForm />
    </PageShell>
  );
}
