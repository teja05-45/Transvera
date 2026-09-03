import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { articles, getArticle } from "@/data/resources";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return { title: article.title, description: article.summary };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <>
      <Navbar />
      <main>
        <article>
          <section className="border-b border-rule">
            <div className="mx-auto max-w-2xl px-5 py-14">
              <span className="text-xs font-medium uppercase tracking-wide text-ledger">{article.category}</span>
              <h1 className="mt-2 font-display text-[2rem] tracking-tight text-ink sm:text-[2.4rem]">
                {article.title}
              </h1>
              <p className="mt-3 text-sm text-ink-faint">{article.readMinutes} min read</p>
            </div>
          </section>
          <section className="mx-auto max-w-2xl px-5 py-14">
            <div className="flex flex-col gap-5">
              {article.body.map((p, i) => (
                <p key={i} className="text-[1.05rem] leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
            <ButtonLink href="/tools" size="lg" className="mt-10">
              Try LedgerFlow
            </ButtonLink>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
