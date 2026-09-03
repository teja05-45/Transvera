import type { ParserResult } from "./parser";
import type { NormalizedTransaction } from "@/types";

export interface DocumentDebugSnapshot {
  documentId: string;
  ocrText: string;
  detectedBank: unknown;
  detectedCurrency: string;
  ocrConfidence: number | null;
  parser: ParserResult["debug"];
  transactions: NormalizedTransaction[];
  validationErrors: unknown[];
  savedTransactions: number;
  createdAt: string;
}

const snapshots = new Map<string, DocumentDebugSnapshot>();

export function saveDocumentDebug(snapshot: DocumentDebugSnapshot): void {
  if (process.env.NODE_ENV !== "production") snapshots.set(snapshot.documentId, snapshot);
}

export function getDocumentDebug(documentId: string): DocumentDebugSnapshot | null {
  if (process.env.NODE_ENV === "production") return null;
  return snapshots.get(documentId) || null;
}
