"use client";

import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildBatchItems, type BatchItem } from "@/lib/bulk";
import { exportProviders, downloadFile } from "@/lib/exporters";
import type { DocumentMeta } from "@/types";
import { cn } from "@/lib/cn";

export function BulkWorkspace() {
  const [pending, setPending] = useState<{ name: string; sizeBytes: number }[]>([]);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))
      .map((f) => ({ name: f.name, sizeBytes: f.size }));
    setPending((prev) => [...prev, ...next]);
  }

  function runBatch() {
    const batch = buildBatchItems(pending).map((b) => ({ ...b, status: "queued" as const }));
    setItems(batch);
    setRunning(true);

    batch.forEach((item, i) => {
      setTimeout(() => {
        setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "processing" } : p)));
      }, i * 350);

      setTimeout(() => {
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, status: p.transactionCount > 0 ? "completed" : "failed" }
              : p
          )
        );
        if (i === batch.length - 1) setRunning(false);
      }, i * 350 + 900);
    });
  }

  function downloadRow(item: BatchItem) {
    const provider = exportProviders.csv!;
    const meta: DocumentMeta = {
      filename: item.filename,
      sizeBytes: item.sizeBytes,
      pageCount: item.pages,
      isDemo: true,
      bank: { name: item.bank, country: "United States", currency: "USD", confidence: 0.95 },
      statementStart: null,
      statementEnd: null,
    };
    downloadFile(provider.generate(item.transactions, meta));
  }

  function downloadCombined() {
    const provider = exportProviders.csv!;
    const all = items.flatMap((i) => i.transactions);
    const meta: DocumentMeta = {
      filename: "combined-batch",
      sizeBytes: 0,
      pageCount: 0,
      isDemo: true,
      bank: null,
      statementStart: null,
      statementEnd: null,
    };
    downloadFile(provider.generate(all, meta));
  }

  const completedCount = items.filter((i) => i.status === "completed" || i.status === "failed").length;

  return (
    <div className="flex flex-col gap-6">
      {items.length === 0 && (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed border-rule-strong bg-paper-raised px-6 py-14 text-center hover:border-ink-soft"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ledger-tint text-ledger-strong">
              <UploadCloud size={22} />
            </div>
            <p className="font-medium text-ink">Drop multiple statement PDFs here</p>
            <p className="text-sm text-ink-faint">or click to choose files</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {pending.length > 0 && (
            <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
              <p className="text-sm font-medium text-ink">{pending.length} files queued</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {pending.map((f, i) => (
                  <li key={f.name + i} className="flex items-center justify-between text-sm text-ink-soft">
                    <span className="truncate">{f.name}</span>
                    <button
                      onClick={() => setPending((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-ink-faint hover:text-error"
                      aria-label="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <Button onClick={runBatch} className="mt-4">
                Process {pending.length} files
              </Button>
            </div>
          )}

          <p className="text-xs text-ink-faint">
            This preview build processes bulk batches with sample data so
            you can see the full batch UI — status tracking, per-file
            failure handling, and combined export. Wiring in real per-file
            extraction uses the same components.
          </p>
        </>
      )}

      {items.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised">
          <div className="flex items-center justify-between border-b border-rule p-4">
            <p className="text-sm font-medium text-ink">
              {completedCount} / {items.length} completed
            </p>
            {!running && (
              <Button size="sm" onClick={downloadCombined}>
                <Download size={14} /> Download combined CSV
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-xs text-ink-faint">
                  <th className="px-4 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">Bank</th>
                  <th className="px-4 py-3 font-medium">Pages</th>
                  <th className="px-4 py-3 font-medium">Transactions</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Output</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-rule/70 last:border-0">
                    <td className="px-4 py-3 text-ink">{item.filename}</td>
                    <td className="px-4 py-3 text-ink-soft">{item.bank}</td>
                    <td className="px-4 py-3 text-ink-soft">{item.pages}</td>
                    <td className="px-4 py-3 text-ink-soft">{item.transactionCount || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={item.status} error={item.errorMessage} />
                    </td>
                    <td className="px-4 py-3">
                      {item.status === "completed" ? (
                        <button
                          onClick={() => downloadRow(item)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-ledger-strong"
                        >
                          <Download size={14} /> CSV
                        </button>
                      ) : (
                        <span className="text-sm text-ink-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, error }: { status: BatchItem["status"]; error?: string }) {
  const map: Record<BatchItem["status"], { label: string; className: string; icon: React.ReactNode }> = {
    queued: { label: "Queued", className: "bg-rule/50 text-ink-soft", icon: null },
    processing: {
      label: "Processing",
      className: "bg-ledger-tint text-ledger-strong",
      icon: <Loader2 size={12} className="animate-spin" />,
    },
    completed: {
      label: "Completed",
      className: "bg-ledger-tint text-ledger-strong",
      icon: <CheckCircle2 size={12} />,
    },
    failed: { label: "Failed", className: "bg-error-tint text-error", icon: <AlertTriangle size={12} /> },
  };
  const s = map[status];
  return (
    <span title={error} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.className)}>
      {s.icon}
      {s.label}
    </span>
  );
}
