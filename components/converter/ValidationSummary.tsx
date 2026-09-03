import type { ValidationSummary as ValidationSummaryT } from "@/types";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ValidationSummary({
  summary,
  onReviewIssues,
}: {
  summary: ValidationSummaryT;
  onReviewIssues: () => void;
}) {
  const allClear = summary.needsReview === 0;
  return (
    <div
      className={
        "flex flex-col gap-3 rounded-[var(--radius-lg)] border p-5 sm:flex-row sm:items-center sm:justify-between " +
        (allClear ? "border-ledger/40 bg-ledger-tint/50" : "border-warning/40 bg-warning-tint/60")
      }
    >
      <div className="flex items-start gap-3">
        {allClear ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ledger-strong" />
        ) : (
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
        )}
        <p className="text-sm text-ink">
          <span className="font-medium">{summary.total} transactions extracted</span> ·{" "}
          {summary.valid} validated
          {summary.needsReview > 0 && (
            <> · <span className="font-medium text-warning">{summary.needsReview} require review</span></>
          )}
        </p>
      </div>
      {!allClear && (
        <button
          onClick={onReviewIssues}
          className="shrink-0 rounded-[var(--radius-md)] border border-warning/50 px-3.5 py-1.5 text-sm font-medium text-warning transition-colors hover:bg-warning/10"
        >
          Review issues
        </button>
      )}
    </div>
  );
}
