import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { useCases, getUseCase } from "@/data/use-cases";
import { converters } from "@/data/converters";
import { Check, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const uc = getUseCase(params.slug);
  if (!uc) return {};
  return { title: uc.audience, description: uc.intro };
}

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const uc = getUseCase(params.slug);
  if (!uc) notFound();

  const recommended = converters.filter((c) => uc.recommendedFormats.includes(c.name));

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <p className="text-sm font-medium text-ledger">For {uc.audience.toLowerCase()}</p>
            <h1 className="mt-2 font-display text-[2.2rem] tracking-tight text-ink sm:text-[2.6rem]">
              {uc.headline}
            </h1>
            <p className="mt-4 max-w-[64ch] text-ink-soft">{uc.intro}</p>
            <ButtonLink href="/tools" size="lg" className="mt-6">
              Start converting <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-14">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-xl text-ink">Common friction</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {uc.painPoints.map((p) => (
                  <li key={p} className="text-sm leading-relaxed text-ink-soft">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl text-ink">A typical workflow</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {uc.workflow.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <Check size={15} className="mt-0.5 shrink-0 text-ledger" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-rule bg-paper-raised">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <h2 className="font-display text-xl text-ink">Recommended converters</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {recommended.map((c) => (
                <ButtonLink
                  key={c.slug}
                  href={`/tools/${c.slug}`}
                  variant="secondary"
                  size="md"
                  className="justify-center"
                >
                  {c.name}
                </ButtonLink>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
