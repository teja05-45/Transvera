import type { DocumentMeta } from "@/types";
import { Badge } from "@/components/ui/Badge";

export function BankDetectionPanel({ meta, transactionCount }: { meta: DocumentMeta; transactionCount: number }) {
  const confidencePct = meta.bank ? Math.round(meta.bank.confidence * 100) : null;
  return (
    <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Document details</p>
        <div className="flex items-center gap-2">
          {meta.extractionMethod === "ocr" && <Badge tone="gold">OCR</Badge>}
          {meta.isDemo && <Badge tone="gold">Sample data</Badge>}
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
        <Field label="Detected bank" value={meta.bank?.name ?? "Unknown"} />
        <Field label="Currency" value={meta.bank?.currency ?? "—"} />
        <Field
          label="Statement period"
          value={
            meta.statementStart && meta.statementEnd
              ? `${meta.statementStart} → ${meta.statementEnd}`
              : "—"
          }
        />
        <Field label="Pages" value={String(meta.pageCount)} />
        <Field label="Transactions found" value={String(transactionCount)} />
        <Field
          label="Confidence"
          value={
            meta.extractionMethod === "ocr" && meta.ocrConfidence !== null && meta.ocrConfidence !== undefined
              ? `${Math.round(meta.ocrConfidence)}% OCR`
              : confidencePct !== null ? `${confidencePct}%` : "—"
          }
          tone={
            (meta.extractionMethod === "ocr" && (meta.ocrConfidence ?? 100) < 85) ||
            (confidencePct !== null && confidencePct < 85)
              ? "warning"
              : undefined
          }
        />
      </dl>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "warning" }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd
        className={
          "mt-1 font-mono text-sm " + (tone === "warning" ? "text-warning" : "text-ink")
        }
      >
        {value}
      </dd>
    </div>
  );
}
