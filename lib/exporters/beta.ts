import type { ExportFormatId } from "@/types";
import type { ExportProvider } from "./index";

// These formats (QuickBooks, Xero, OFX, Tally, Zoho Books, FreshBooks)
// implement the same ExportProvider interface as CSV/XLSX/JSON, so wiring
// a real, spec-validated generator in later is a matter of swapping the
// `generate` implementation — not restructuring the app. Until each
// format's output has been validated against the real target software,
// the workspace UI shows a "Beta" badge instead of a working "Generate"
// button, per the product's no-fake-claims requirement.

export const betaFormatNotes: Partial<Record<ExportFormatId, string>> = {
  quickbooks:
    "QBO generation is implemented against the OFX 1.0/QBO spec, but hasn't yet been validated against a live QuickBooks import. Marked beta until confirmed.",
  xero: "Xero's bank statement CSV columns are mapped, pending validation against a live Xero import.",
  ofx: "OFX structure (account, transaction IDs, memos) is implemented, pending validation against target software.",
  "google-sheets":
    "Direct Sheets export requires a connected Google account. Falls back to XLSX/CSV today.",
  tally: "Tally XML voucher/ledger structure is scaffolded, pending validation against Tally Prime import.",
  "zoho-books": "Column mapping to Zoho Books' import format is scaffolded, pending validation.",
  freshbooks: "Column mapping to FreshBooks' import format is scaffolded, pending validation.",
};

// Placeholder provider registry — intentionally not wired into the working
// download flow yet. Present so the interface boundary is visible in code,
// not just in docs.
export const plannedProviders: Partial<Record<ExportFormatId, Pick<ExportProvider, "formatId" | "fileExtension">>> = {
  quickbooks: { formatId: "quickbooks", fileExtension: ".qbo" },
  xero: { formatId: "xero", fileExtension: ".csv" },
  ofx: { formatId: "ofx", fileExtension: ".ofx" },
  tally: { formatId: "tally", fileExtension: ".xml" },
  "zoho-books": { formatId: "zoho-books", fileExtension: ".csv" },
  freshbooks: { formatId: "freshbooks", fileExtension: ".csv" },
};
