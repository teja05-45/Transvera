import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-ledger">Free during beta</span>
          <h1 className="mt-4 max-w-[16ch] font-display text-[2.6rem] leading-[1.08] tracking-tight text-ink sm:text-[3.2rem]">
            Your statements shouldn&apos;t need retyping.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
            Upload a bank statement PDF. LedgerFlow reads it, extracts every
            transaction, and hands you a clean file in the format your
            accounting stack already speaks.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/tools" size="lg">
              Start converting <ArrowRight size={17} />
            </ButtonLink>
            <ButtonLink href="/tools" variant="secondary" size="lg">
              Explore converters
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-ink-faint">
            No card required. No account required to try a sample statement.
          </p>
        </div>

        <StatementToDataVisual />
      </div>
    </section>
  );
}

function StatementToDataVisual() {
  return (
    <div className="relative flex items-center justify-center py-4">
      <svg viewBox="0 0 460 360" className="w-full max-w-[440px]" role="img" aria-label="A bank statement PDF being converted into a structured transaction table">
        {/* Document */}
        <g>
          <rect x="18" y="18" width="150" height="200" rx="4" fill="var(--paper-raised)" stroke="var(--rule-strong)" />
          <rect x="34" y="38" width="70" height="7" rx="2" fill="var(--ink)" opacity="0.75" />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x="34" y={62 + i * 15} width={i % 3 === 0 ? 118 : 100} height="5" rx="2" fill="var(--rule-strong)" />
          ))}
        </g>

        {/* Arrow / process */}
        <g>
          <path d="M182 118 H236" stroke="var(--ledger)" strokeWidth="2" markerEnd="url(#arrow)" />
          <circle cx="209" cy="118" r="22" fill="var(--ledger-tint)" />
          <path d="M200 118l6 6 12-14" stroke="var(--ledger-strong)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Table */}
        <g>
          <rect x="248" y="40" width="196" height="220" rx="4" fill="var(--paper-raised)" stroke="var(--rule-strong)" />
          <rect x="248" y="40" width="196" height="26" rx="4" fill="var(--ink)" />
          <text x="260" y="57" fontSize="10" fill="var(--paper)" fontFamily="var(--font-mono)">DATE  DESC  AMOUNT</text>
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i}>
              <rect x="248" y={66 + i * 25} width="196" height="25" fill={i % 2 === 0 ? "var(--paper)" : "var(--paper-raised)"} />
              <rect x="260" y={78 + i * 25} width="34" height="5" rx="1.5" fill="var(--ink-faint)" />
              <rect x="304" y={78 + i * 25} width="70" height="5" rx="1.5" fill="var(--rule-strong)" />
              <rect x="386" y={78 + i * 25} width="40" height="5" rx="1.5" fill="var(--ledger)" opacity={i === 2 ? 1 : 0.55} />
            </g>
          ))}
        </g>

        {/* Output chips */}
        <g fontFamily="var(--font-mono)" fontSize="11" fontWeight={500}>
          {["CSV", "XLSX", "JSON", "QBO"].map((label, i) => (
            <g key={label} transform={`translate(${18 + i * 76}, 290)`}>
              <rect width="66" height="30" rx="15" fill="var(--paper-raised)" stroke="var(--rule)" />
              <text x="33" y="19.5" textAnchor="middle" fill="var(--ink-soft)">
                {label}
              </text>
            </g>
          ))}
        </g>
        <path d="M300 264 L200 290" stroke="var(--rule-strong)" strokeWidth="1.4" />

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--ledger)" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
