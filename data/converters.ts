import type { ConverterDefinition } from "@/types";

// Single registry every converter-facing surface reads from: the homepage
// grid, /tools directory, and the dynamic /tools/[slug] workspace all
// derive from this list. Adding a converter later means adding one entry
// here plus one exporter implementation — not a new page.
export const converters: ConverterDefinition[] = [
  {
    slug: "bank-statement-to-csv",
    formatId: "csv",
    name: "CSV",
    fileExtension: ".csv",
    title: "Bank Statement to CSV",
    shortDescription: "Clean, comma-separated transaction data for spreadsheets or scripts.",
    longDescription:
      "Upload a bank statement PDF and get a plain CSV file with one row per transaction — ready for a spreadsheet, a database import, or your own scripts.",
    bestFor: "Spreadsheets, data pipelines, quick analysis",
    category: "Spreadsheet",
    maturity: "available",
  },
  {
    slug: "bank-statement-to-excel",
    formatId: "xlsx",
    name: "Excel",
    fileExtension: ".xlsx",
    title: "Bank Statement to Excel",
    shortDescription: "A formatted .xlsx workbook with headers, filters, and a frozen top row.",
    longDescription:
      "Get a properly formatted Excel workbook — typed dates, separate debit and credit columns, a running balance, auto-sized columns, and a frozen header row so it's usable the moment it opens.",
    bestFor: "Bookkeeping, manual review, sharing with clients",
    category: "Spreadsheet",
    maturity: "available",
  },
  {
    slug: "bank-statement-to-json",
    formatId: "json",
    name: "JSON",
    fileExtension: ".json",
    title: "Bank Statement to JSON",
    shortDescription: "A structured JSON document for developers and integrations.",
    longDescription:
      "Get statement metadata and every transaction as clean, structured JSON — built for feeding into your own application, warehouse, or automation.",
    bestFor: "Developers, integrations, data warehouses",
    category: "Developer",
    maturity: "available",
  },
  {
    slug: "bank-statement-to-quickbooks",
    formatId: "quickbooks",
    name: "QuickBooks",
    fileExtension: ".qbo",
    title: "Bank Statement to QuickBooks",
    shortDescription: "A QuickBooks-compatible .QBO file built from your transactions.",
    longDescription:
      "Generate a .QBO file structured for QuickBooks' bank-feed import. This exporter is in beta while we validate output against more account and bank configurations.",
    bestFor: "QuickBooks Online and Desktop users",
    category: "Accounting",
    maturity: "beta",
  },
  {
    slug: "bank-statement-to-xero",
    formatId: "xero",
    name: "Xero",
    fileExtension: ".csv",
    title: "Bank Statement to Xero",
    shortDescription: "A Xero-ready bank statement import file.",
    longDescription:
      "Generate a CSV formatted for Xero's bank statement import, with date, description, amount, and reference mapped to Xero's expected columns. Currently in beta.",
    bestFor: "Xero-based bookkeeping workflows",
    category: "Accounting",
    maturity: "beta",
  },
  {
    slug: "bank-statement-to-ofx",
    formatId: "ofx",
    name: "OFX",
    fileExtension: ".ofx",
    title: "Bank Statement to OFX",
    shortDescription: "Open Financial Exchange format for broad accounting-software support.",
    longDescription:
      "Generate an OFX file — account metadata, transaction identifiers, dates, amounts, and memos — compatible with most accounting software that accepts bank-feed imports.",
    bestFor: "Software that accepts OFX bank feeds",
    category: "Banking",
    maturity: "beta",
  },
  {
    slug: "bank-statement-to-google-sheets",
    formatId: "google-sheets",
    name: "Google Sheets",
    fileExtension: ".xlsx",
    title: "Bank Statement to Google Sheets",
    shortDescription: "Spreadsheet-ready output you can import straight into Sheets.",
    longDescription:
      "Direct Google Sheets export is coming soon. In the meantime, download a Sheets-compatible XLSX or CSV and import it in a couple of clicks.",
    bestFor: "Teams that live in Google Sheets",
    category: "Productivity",
    maturity: "beta",
  },
  {
    slug: "bank-statement-to-tally",
    formatId: "tally",
    name: "Tally",
    fileExtension: ".xml",
    title: "Bank Statement to Tally",
    shortDescription: "Tally-compatible XML with vouchers and ledger narration.",
    longDescription:
      "Generate Tally-importable XML with vouchers, ledger references, debit/credit entries, and narration built from your statement. Mappings are configurable per bank.",
    bestFor: "Tally ERP / Tally Prime users in India",
    category: "Accounting",
    maturity: "beta",
  },
  {
    slug: "bank-statement-to-zoho-books",
    formatId: "zoho-books",
    name: "Zoho Books",
    fileExtension: ".csv",
    title: "Bank Statement to Zoho Books",
    shortDescription: "An import file mapped to Zoho Books' bank statement format.",
    longDescription:
      "Generate a CSV mapped to Zoho Books' bank statement import columns, with configurable field mapping. Currently in beta.",
    bestFor: "Zoho Books users",
    category: "Accounting",
    maturity: "beta",
  },
  {
    slug: "bank-statement-to-freshbooks",
    formatId: "freshbooks",
    name: "FreshBooks",
    fileExtension: ".csv",
    title: "Bank Statement to FreshBooks",
    shortDescription: "An import-ready file for FreshBooks expense and transaction import.",
    longDescription:
      "Generate a CSV structured for FreshBooks' transaction import. Currently in beta while we validate against live FreshBooks accounts.",
    bestFor: "Freelancers and small teams on FreshBooks",
    category: "Accounting",
    maturity: "beta",
  },
];

export function getConverterBySlug(slug: string) {
  return converters.find((c) => c.slug === slug);
}
