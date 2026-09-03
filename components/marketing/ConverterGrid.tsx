import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { converters } from "@/data/converters";
import { Badge } from "@/components/ui/Badge";

export function ConverterGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-16">
        {heading && (
          <div className="mb-10 max-w-[52ch]">
            <h2 className="font-display text-[2rem] tracking-tight text-ink">
              One upload, ten destinations
            </h2>
            <p className="mt-3 text-ink-soft">
              Every converter runs on the same extraction engine — pick the
              output your accounting stack needs.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {converters.map((c) => (
            <Link
              key={c.slug}
              href={`/tools/${c.slug}`}
              className="group flex flex-col justify-between gap-6 bg-paper-raised p-6 transition-colors hover:bg-ledger-tint/40"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs tracking-wide text-ink-faint">
                    {c.fileExtension}
                  </span>
                  {c.maturity === "beta" && <Badge tone="gold">Beta</Badge>}
                </div>
                <h3 className="mt-3 font-display text-xl text-ink">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {c.shortDescription}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
                Convert
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
