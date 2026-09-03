const steps = [
  {
    n: "1",
    title: "Upload",
    body: "Drag in a bank statement PDF, or try a sample statement with no upload at all.",
  },
  {
    n: "2",
    title: "Analyze",
    body: "LedgerFlow detects the bank, reads the statement, and extracts every transaction.",
  },
  {
    n: "3",
    title: "Review",
    body: "Check the extracted transactions, fix anything flagged for review, and confirm.",
  },
  {
    n: "4",
    title: "Export",
    body: "Generate the format you need and download it — CSV, Excel, JSON, and more.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-rule bg-paper-raised">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-[2rem] tracking-tight text-ink">How it works</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative pl-0">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-ledger">{s.n}</span>
                <h3 className="font-display text-lg text-ink">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              {i < steps.length - 1 && (
                <div className="mt-6 hidden h-px w-full bg-rule lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
