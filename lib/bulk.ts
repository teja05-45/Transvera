import type { NormalizedTransaction } from "@/types";
import { demoTransactions } from "@/lib/demo-data";

export type BatchItemStatus = "queued" | "processing" | "completed" | "failed";

export interface BatchItem {
  id: string;
  filename: string;
  sizeBytes: number;
  bank: string;
  pages: number;
  status: BatchItemStatus;
  transactionCount: number;
  transactions: NormalizedTransaction[];
  errorMessage?: string;
}

const sampleBanks = ["Horizon National Bank", "Cedarbrook Credit Union", "Pinehill Savings"];

// Deterministic-ish demo batch generator: takes real uploaded filenames,
// assigns each a slice of the shared demo transaction set (with unique
// ids) so a bulk run has real, distinct, exportable data per file rather
// than duplicating one dataset four times.
export function buildBatchItems(filenames: { name: string; sizeBytes: number }[]): BatchItem[] {
  return filenames.map((f, i) => {
    const willFail = i === 2 && filenames.length > 2; // demonstrate per-file failure handling
    const slice = demoTransactions
      .slice(0, demoTransactions.length - (i % 4))
      .map((t) => ({ ...t, id: `${f.name}-${t.id}` }));

    return {
      id: `${f.name}-${i}`,
      filename: f.name,
      sizeBytes: f.sizeBytes,
      bank: sampleBanks[i % sampleBanks.length],
      pages: 2 + (i % 4),
      status: "queued",
      transactionCount: willFail ? 0 : slice.length,
      transactions: willFail ? [] : slice,
      errorMessage: willFail ? "Statement page 2 is unreadable — try re-scanning at a higher resolution." : undefined,
    };
  });
}
