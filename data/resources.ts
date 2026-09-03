export interface Article {
  slug: string;
  title: string;
  category: string;
  summary: string;
  readMinutes: number;
  body: string[]; // paragraphs
}

export const articles: Article[] = [
  {
    slug: "convert-bank-statement-pdf-to-excel",
    title: "How to convert a bank statement PDF to Excel",
    category: "Converter Guides",
    summary: "The manual approach, why it breaks down, and a faster path to a clean spreadsheet.",
    readMinutes: 4,
    body: [
      "Most bank statement PDFs aren't built to be copied into a spreadsheet. Column alignment breaks, dates come through as plain text, and running balances rarely line up with the debit and credit columns once you paste them in.",
      "The manual approach usually looks like this: open the PDF, select the transaction table, copy it into Excel, then spend twenty minutes fixing broken rows, re-splitting merged columns, and reformatting dates so they behave like dates instead of text.",
      "A structured conversion skips that cleanup entirely. Instead of copying visual text, the statement is read for its underlying transaction data — date, description, reference, debit, credit, and balance — and written directly into a workbook with the right column types, a frozen header row, and filters already applied.",
      "Once you have a clean workbook, reconciliation is just a matter of checking the numbers, not fighting the formatting.",
    ],
  },
  {
    slug: "import-bank-transactions-into-quickbooks",
    title: "How to import bank transactions into QuickBooks",
    category: "Accounting Workflows",
    summary: "What QuickBooks expects from an import file, and where statement conversions commonly go wrong.",
    readMinutes: 5,
    body: [
      "QuickBooks' bank feed import expects a specific structure — typically a QBO or CSV file with clearly defined date, amount, and description fields, mapped to the correct bank account.",
      "The most common failure point isn't the import itself, it's the source data. A statement PDF converted without attention to formatting can produce ambiguous dates (is 03/04 March 4th or April 3rd?), inconsistent sign conventions on amounts, or descriptions that get truncated mid-import.",
      "Before importing, it's worth checking three things: that dates are in an unambiguous ISO or explicitly labeled format, that debits and credits are represented consistently, and that the account the file is being imported into matches the statement's actual account.",
      "Getting those three things right before the import avoids the more tedious problem of finding and fixing miscategorized transactions after they've already landed in your books.",
    ],
  },
  {
    slug: "convert-bank-statements-to-csv",
    title: "How to convert bank statements to CSV",
    category: "Converter Guides",
    summary: "CSV is the lowest common denominator for financial data — here's how to get there cleanly.",
    readMinutes: 3,
    body: [
      "CSV remains the most portable format for transaction data. Nearly every spreadsheet tool, accounting system, and internal script can read it, which is why it's usually the first export people reach for.",
      "The challenge with statement PDFs is that a CSV is only as good as the extraction behind it. A naive text-extraction approach often produces a single unstructured column of text per line, rather than distinct date, description, and amount fields.",
      "A properly structured CSV export separates these fields explicitly — one column per data point — so the file can be opened, filtered, or piped into another tool without additional cleanup.",
    ],
  },
  {
    slug: "prepare-bank-data-for-xero",
    title: "How to prepare bank data for Xero",
    category: "Accounting Workflows",
    summary: "Getting statement data into a shape Xero's bank statement import expects.",
    readMinutes: 4,
    body: [
      "Xero's bank statement import expects a CSV with specific columns — typically date, amount, payee, and reference — mapped during the import wizard.",
      "Statement conversions that preserve a consistent reference field make reconciliation in Xero considerably faster, since Xero can use that reference to help match imported transactions against existing bills or invoices.",
      "It's worth double-checking currency consistency too, particularly for accounts that occasionally show foreign-currency transactions — Xero will flag amounts that don't match the account's base currency.",
    ],
  },
  {
    slug: "convert-bank-statements-to-tally",
    title: "How to convert bank statements to Tally",
    category: "Converter Guides",
    summary: "What Tally's voucher structure needs from a converted bank statement.",
    readMinutes: 4,
    body: [
      "Tally represents bank transactions as vouchers tied to a ledger, rather than as flat rows in a spreadsheet. That means a converted statement needs more than just date, description, and amount — it needs each transaction mapped to the correct ledger and voucher type.",
      "For straightforward accounts, this mapping can often be automated: debits and credits map predictably to payment and receipt vouchers, and the bank ledger stays constant across the statement.",
      "The bigger variable is narration — the free-text description Tally shows against each voucher. Preserving the original transaction description here (rather than a generic label) makes it much easier to reconcile later.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
