export interface UseCase {
  slug: string;
  audience: string;
  headline: string;
  intro: string;
  painPoints: string[];
  workflow: string[];
  recommendedFormats: string[];
}

export const useCases: UseCase[] = [
  {
    slug: "accountants",
    audience: "Accountants",
    headline: "Turn client statements into workpapers, not data entry",
    intro:
      "When a client hands you a stack of bank statement PDFs, retyping them is the least valuable part of your job. LedgerFlow extracts the transactions so you can get straight to reconciliation and review.",
    painPoints: [
      "Manually retyping transactions from client-provided PDFs",
      "Reconciling numbers that were transcribed by hand and prone to typos",
      "Juggling different statement formats across multiple client banks",
    ],
    workflow: [
      "Upload each client's statement PDF",
      "Confirm the detected bank and review flagged transactions",
      "Export to Excel or CSV for your existing workpaper templates",
    ],
    recommendedFormats: ["Excel", "CSV", "JSON"],
  },
  {
    slug: "bookkeepers",
    audience: "Bookkeepers",
    headline: "Reconcile faster with clean, structured exports",
    intro:
      "Bookkeeping runs on accurate, well-structured transaction data. LedgerFlow gets statements into a normalized format so reconciliation isn't fighting the data before you can even start.",
    painPoints: [
      "Reconciling statements that don't match your accounting software's import format",
      "Chasing down missing or misread transaction dates and amounts",
      "Manually splitting debits and credits into separate columns",
    ],
    workflow: [
      "Upload a statement or run a bulk batch across multiple accounts",
      "Review the debit/credit split and running balance",
      "Export to QuickBooks, Xero, or CSV for your ledger of choice",
    ],
    recommendedFormats: ["QuickBooks", "Xero", "CSV"],
  },
  {
    slug: "small-business",
    audience: "Small businesses",
    headline: "Get your own statements into a format your books understand",
    intro:
      "You don't need a full accounting team to get clean transaction data. Upload your business bank statement and export it straight into whatever tool you already use to track expenses.",
    painPoints: [
      "No time to manually enter every transaction each month",
      "Bank exports that don't match your accounting software's expected columns",
      "Needing a simple spreadsheet view of spending without extra tools",
    ],
    workflow: [
      "Upload your monthly statement PDF",
      "Skim the transaction list for anything that looks off",
      "Export to Excel for a quick review, or straight into your accounting software",
    ],
    recommendedFormats: ["Excel", "QuickBooks", "FreshBooks"],
  },
  {
    slug: "finance-teams",
    audience: "Finance teams",
    headline: "Standardize statement data across accounts and entities",
    intro:
      "Multiple accounts, multiple banks, multiple formats. LedgerFlow normalizes every statement into the same transaction structure regardless of the source, so downstream reporting doesn't have to handle a dozen edge cases.",
    painPoints: [
      "Inconsistent statement formats across banking relationships",
      "Manual consolidation before data reaches a reporting pipeline",
      "No single structured schema to build automation on top of",
    ],
    workflow: [
      "Bulk upload statements across accounts and entities",
      "Review flagged transactions per batch",
      "Export to JSON for internal pipelines, or CSV/Excel for reporting",
    ],
    recommendedFormats: ["JSON", "CSV", "Excel"],
  },
  {
    slug: "tax-professionals",
    audience: "Tax professionals",
    headline: "Prepare transaction data for filing season without retyping",
    intro:
      "Filing season means a lot of source documents in a short window. Getting client statements into structured, reviewable transaction data faster means more time for the actual analysis.",
    painPoints: [
      "High volume of client-provided PDFs during a compressed filing window",
      "Needing a clean transaction list to cross-reference against receipts",
      "Manual transcription errors that surface late in the review process",
    ],
    workflow: [
      "Upload client statements as they come in",
      "Review and flag anything that needs client follow-up",
      "Export to CSV or Excel for your existing filing workflow",
    ],
    recommendedFormats: ["CSV", "Excel", "JSON"],
  },
  {
    slug: "data-analysts",
    audience: "Data analysts",
    headline: "Get statement data into JSON for your own pipelines",
    intro:
      "You don't want a formatted spreadsheet — you want structured records you can pipe into your own tools. LedgerFlow's JSON export gives you a normalized transaction schema built for that.",
    painPoints: [
      "PDFs are a dead end for programmatic analysis without manual extraction",
      "Inconsistent field naming and formats across statement sources",
      "Needing a stable schema to build downstream tooling against",
    ],
    workflow: [
      "Upload statements individually or in bulk",
      "Spot-check flagged transactions for extraction confidence",
      "Export to JSON with a consistent, documented schema",
    ],
    recommendedFormats: ["JSON", "CSV"],
  },
];

export function getUseCase(slug: string) {
  return useCases.find((u) => u.slug === slug);
}
