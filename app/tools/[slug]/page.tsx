import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ConverterWorkspace } from "@/components/converter/ConverterWorkspace";
import { Badge } from "@/components/ui/Badge";
import { converters, getConverterBySlug } from "@/data/converters";

export function generateStaticParams() {
  return converters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const converter = getConverterBySlug(slug);
  if (!converter) return {};
  return {
    title: converter.title,
    description: converter.longDescription,
    alternates: { canonical: `/tools/${converter.slug}` },
    openGraph: {
      title: `${converter.title} · LedgerFlow AI`,
      description: converter.longDescription,
    },
  };
}

export default async function ConverterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const converter = getConverterBySlug(slug);
  if (!converter) notFound();

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-[2rem] tracking-tight text-ink sm:text-[2.4rem]">
                {converter.title}
              </h1>
              {converter.maturity === "beta" && <Badge tone="gold">Beta export</Badge>}
            </div>
            <p className="mt-3 max-w-[64ch] text-ink-soft">{converter.longDescription}</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12">
          <ConverterWorkspace converter={converter} />
        </section>
      </main>
      <Footer />
    </>
  );
}
