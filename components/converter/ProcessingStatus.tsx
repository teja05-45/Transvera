import { Check, Loader2 } from "lucide-react";
import type { ProcessingStepState } from "@/types";

export function ProcessingStatus({ steps }: { steps: ProcessingStepState[] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6">
      <p className="text-sm font-medium text-ink">Processing your statement</p>
      <ul className="mt-5 flex flex-col gap-4">
        {steps.map((s) => (
          <li key={s.stage} className="flex items-center gap-3">
            <span
              className={
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs " +
                (s.status === "complete"
                  ? "bg-ledger text-paper"
                  : s.status === "active"
                  ? "bg-ledger-tint text-ledger-strong"
                  : "bg-rule/60 text-ink-faint")
              }
            >
              {s.status === "complete" ? (
                <Check size={13} />
              ) : s.status === "active" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                ""
              )}
            </span>
            <span
              className={
                "text-sm " +
                (s.status === "pending" ? "text-ink-faint" : "text-ink")
              }
            >
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
