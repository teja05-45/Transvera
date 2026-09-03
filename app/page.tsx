import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { TrustSection } from "@/components/marketing/Sections";
import { ConverterGrid } from "@/components/marketing/ConverterGrid";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import {
  Benefits,
  UseCasesSection,
  SecuritySnapshot,
  FAQSection,
  FinalCTA,
} from "@/components/marketing/Sections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <ConverterGrid />
        <HowItWorks />
        <Benefits />
        <UseCasesSection />
        <SecuritySnapshot />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
