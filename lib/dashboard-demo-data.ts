import { demoTransactions } from "./demo-data";

export interface HistoryRow {
  id: string;
  document: string;
  bank: string;
  date: string;
  format: string;
  transactions: number;
  status: "Completed" | "Failed";
}

export const historyRows: HistoryRow[] = [
  { id: "h1", document: "july-statement.pdf", bank: "Horizon National Bank", date: "2026-08-01", format: "CSV", transactions: 23, status: "Completed" },
  { id: "h2", document: "june-statement.pdf", bank: "Horizon National Bank", date: "2026-07-02", format: "XLSX", transactions: 26, status: "Completed" },
  { id: "h3", document: "may-statement.pdf", bank: "Cedarbrook Credit Union", date: "2026-06-01", format: "JSON", transactions: 19, status: "Completed" },
  { id: "h4", document: "april-statement.pdf", bank: "Pinehill Savings", date: "2026-05-03", format: "CSV", transactions: 0, status: "Failed" },
  { id: "h5", document: "march-statement.pdf", bank: "Horizon National Bank", date: "2026-04-01", format: "QuickBooks", transactions: 21, status: "Completed" },
];

export interface FileRow {
  id: string;
  filename: string;
  bank: string;
  currency: string;
  period: string;
  pages: number;
  transactions: number;
  status: "Ready" | "Needs review";
}

export const fileRows: FileRow[] = [
  { id: "f1", filename: "july-statement.pdf", bank: "Horizon National Bank", currency: "USD", period: "Jul 2026", pages: 3, transactions: demoTransactions.length, status: "Ready" },
  { id: "f2", filename: "june-statement.pdf", bank: "Horizon National Bank", currency: "USD", period: "Jun 2026", pages: 3, transactions: 26, status: "Ready" },
  { id: "f3", filename: "may-statement.pdf", bank: "Cedarbrook Credit Union", currency: "USD", period: "May 2026", pages: 2, transactions: 19, status: "Needs review" },
];
