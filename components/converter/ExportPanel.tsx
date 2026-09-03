"use client";

import { useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import type { ConverterDefinition } from "@/types";
import type { DocumentMeta, NormalizedTransaction } from "@/types";
import { exportProviders, downloadFile, type GeneratedFile } from "@/lib/exporters";
import { betaFormatNotes } from "@/lib/exporters/beta";
import { Badge } from "@/components/ui/Badge";

interface Props {
  converter: ConverterDefinition;
  transactions: NormalizedTransaction[];
  meta: DocumentMeta;
}

export function ExportPanel({ converter, transactions, meta }: Props) {
  const [state, setState] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [file, setFile] = useState<GeneratedFile | null>(null);
  const provider = exportProviders[converter.formatId];

  function handleGenerate() {
    if (!provider) return;
    setState("generating");
    // Export runs as a discrete step (mirrors the EXPORT job in the
    // background-job architecture) so the UI can show real progress.
    setTimeout(() => {
      try {
        const generated = provider.generate(transactions, meta);
        setFile(generated);
        setState("ready");
      } catch {
        setState("error");
      }
    }, 550);
  }

  if (!provider) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Export to {converter.name}</p>
          <Badge tone="gold">Beta</Badge>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {betaFormatNotes[converter.formatId] ??
            "This exporter's architecture is in place but its output hasn't been validated against the real target system yet."}
        </p>
        <p className="mt-3 text-xs text-ink-faint">
          Try CSV, Excel, or JSON below — those are fully working today.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6">
      <p className="text-sm font-medium text-ink">Export to {converter.name}</p>
      <p className="mt-1 text-sm text-ink-soft">
        {transactions.length} transactions ready · {converter.fileExtension} file
      </p>

      {state !== "ready" && (
        <button
          onClick={handleGenerate}
          disabled={state === "generating" || transactions.length === 0}
          className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-[var(--ledger-strong)] disabled:opacity-40"
        >
          {state === "generating" ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Generating {converter.name}…
            </>
          ) : (
            <>Generate {converter.name}</>
          )}
        </button>
      )}

      {state === "error" && (
        <p className="mt-3 text-sm text-error">
          We couldn&apos;t generate the requested format. Try again, or choose a different format.
        </p>
      )}

      {state === "ready" && file && (
        <div className="mt-4 flex flex-col gap-3 rounded-[var(--radius-md)] border border-ledger/40 bg-ledger-tint/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-ledger-strong" />
            <div>
              <p className="text-sm font-medium text-ink">Your file is ready.</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {file.filename} · {formatBytes(file.blob.size)} · {transactions.length} transactions
              </p>
            </div>
          </div>
          <button
            onClick={() => downloadFile(file)}
            className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-md)] bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-[var(--ledger-strong)]"
          >
            <Download size={15} /> Download
          </button>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
