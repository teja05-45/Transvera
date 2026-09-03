// Core domain types shared across UI, services, and exporters.
// This is the "contract" the whole product is built around: every bank
// parser writes NormalizedTransaction rows, and every exporter reads them.

export type ExportFormatId =
  | "csv"
  | "xlsx"
  | "json"
  | "quickbooks"
  | "xero"
  | "ofx"
  | "google-sheets"
  | "tally"
  | "zoho-books"
  | "freshbooks";

export type ExporterMaturity = "available" | "beta" | "coming-soon";

export interface ConverterDefinition {
  slug: string;
  formatId: ExportFormatId;
  name: string; // e.g. "CSV"
  fileExtension: string; // e.g. ".csv"
  title: string; // page H1
  shortDescription: string; // card description
  longDescription: string; // page intro paragraph
  bestFor: string;
  category: "Spreadsheet" | "Accounting" | "Developer" | "Banking" | "Productivity";
  maturity: ExporterMaturity;
}

export type DocumentStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "detecting-bank"
  | "extracting"
  | "validating"
  | "needs-review"
  | "ready"
  | "failed";

export interface DetectedBank {
  name: string;
  country: string;
  currency: string;
  confidence: number; // 0–1
}

export interface DocumentMeta {
  filename: string;
  sizeBytes: number;
  pageCount: number;
  isDemo: boolean;
  extractionMethod?: "pdf-text" | "ocr";
  ocrConfidence?: number | null;
  bank: DetectedBank | null;
  statementStart: string | null;
  statementEnd: string | null;
}

export interface NormalizedTransaction {
  id: string;
  date: string | null; // ISO date
  description: string;
  reference: string;
  debit: number | null;
  credit: number | null;
  balance: number | null;
  currency: string;
  category: string | null;
  confidence: number; // 0–1
  needsReview: boolean;
  rawText?: string;
  sourcePage?: number;
  sourceLineStart?: number;
  sourceLineEnd?: number;
  sourceBoundingBox?: { x: number; y: number; width: number; height: number };
  financialEvidence?: FinancialEvidence[];
}

export interface FinancialEvidence {
  rawOCRValue: string;
  normalizedValue: number | null;
  confidence: number;
  needsReview: boolean;
  sourcePage?: number;
  sourceBoundingBox?: { x: number; y: number; width: number; height: number };
}

export interface ValidationSummary {
  total: number;
  valid: number;
  needsReview: number;
  issues: string[];
}

export type ProcessingStage =
  | "uploading"
  | "analyzing"
  | "detecting-bank"
  | "extracting"
  | "validating"
  | "done";

export interface ProcessingStepState {
  stage: ProcessingStage;
  label: string;
  status: "pending" | "active" | "complete" | "error";
}
