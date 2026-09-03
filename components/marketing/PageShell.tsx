import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-14">
            {eyebrow && (
              <p className="text-sm font-medium text-ledger">{eyebrow}</p>
            )}
            <h1 className="mt-2 font-display text-[2.2rem] tracking-tight text-ink sm:text-[2.6rem]">
              {title}
            </h1>
            {intro && <p className="mt-4 max-w-[64ch] text-ink-soft">{intro}</p>}
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-5 py-14">{children}</section>
      </main>
      <Footer />
    </>
  );
}
