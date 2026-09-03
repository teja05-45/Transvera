/**
 * Generic Transaction Parser
 * Extracts transaction data from bank statement text
 * Supports common formats with Date, Description, Debit, Credit, Balance columns
 */

import type { NormalizedTransaction } from "@/types";
import { v4 as uuid } from "uuid";

export interface ParserResult {
  transactions: NormalizedTransaction[];
  statementStart: string | null;
  statementEnd: string | null;
  currency: string;
}

/**
 * Parse dates in various formats
 */
function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim().length === 0) return null;

  // Remove whitespace
  dateStr = dateStr.trim();

  // Try ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Try DD/MM/YYYY, DD-MM-YYYY
  const dmyMatch = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dmyMatch) {
    let day = dmyMatch[1];
    let month = dmyMatch[2];
    let year = dmyMatch[3];

    // Pad day/month
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");

    // Handle 2-digit years
    if (year.length === 2) {
      const y = parseInt(year, 10);
      year = (y > 50 ? 1900 : 2000) + y + "";
    }

    // Validate
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
      return `${year}-${month}-${day}`;
    }
  }

  // Try MM/DD/YYYY, MM-DD-YYYY (US format)
  const mdyMatch = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (mdyMatch) {
    let month = mdyMatch[1];
    let day = mdyMatch[2];
    let year = mdyMatch[3];

    month = month.padStart(2, "0");
    day = day.padStart(2, "0");

    if (year.length === 2) {
      const y = parseInt(year, 10);
      year = (y > 50 ? 1900 : 2000) + y + "";
    }

    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
      return `${year}-${month}-${day}`;
    }
  }

  // Try DD MMM YYYY (e.g., "15 Jan 2024")
  const monthNames: { [key: string]: string } = {
    jan: "01", january: "01",
    feb: "02", february: "02",
    mar: "03", march: "03",
    apr: "04", april: "04",
    may: "05",
    jun: "06", june: "06",
    jul: "07", july: "07",
    aug: "08", august: "08",
    sep: "09", september: "09",
    oct: "10", october: "10",
    nov: "11", november: "11",
    dec: "12", december: "12",
  };

  const dmnMatch = dateStr.match(/^(\d{1,2})\s+(\w+)\s+(\d{2,4})$/i);
  if (dmnMatch) {
    const day = dmnMatch[1].padStart(2, "0");
    const month = monthNames[dmnMatch[2].toLowerCase()];
    let year = dmnMatch[3];

    if (month && year) {
      if (year.length === 2) {
        const y = parseInt(year, 10);
        year = (y > 50 ? 1900 : 2000) + y + "";
      }
      return `${year}-${month}-${day}`;
    }
  }

  return null;
}

/**
 * Parse amount strings (handles commas, currency symbols, etc.)
 */
function parseAmount(amountStr: string): number | null {
  if (!amountStr || amountStr.trim().length === 0) return null;

  // Remove currency symbols and whitespace
  let cleaned = amountStr
    .replace(/[$£€¥₹]/g, "")
    .replace(/\s/g, "")
    .trim();

  if (cleaned.length === 0) return null;

  // Handle comma as thousands separator: 1,234.56
  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/,/g, "");
  }
  // Handle comma as decimal separator: 1.234,56 (European)
  else if (cleaned.includes(".") && cleaned.includes(",")) {
    if (cleaned.lastIndexOf(".") < cleaned.lastIndexOf(",")) {
      // Comma is decimal separator
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      // Comma is thousands separator
      cleaned = cleaned.replace(/,/g, "");
    }
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.round(num * 100) / 100; // Round to 2 decimals
}

/**
 * Extract date range from statement text
 */
function extractDateRange(text: string): { start: string | null; end: string | null } {
  // Look for patterns like "Statement from July 1, 2026 to July 31, 2026"
  const rangeMatch = text.match(
    /(?:from|period|for)[\s\S]{0,50}?(\d{1,2}\s+\w+\s+\d{4}|\\d{1,2}[/\\-]\d{1,2}[/\\-]\d{2,4}).{0,50}(?:to|through|thru).{0,10}(\d{1,2}\s+\w+\s+\d{4}|\d{1,2}[/\\-]\d{1,2}[/\\-]\d{2,4})/i
  );

  let start: string | null = null;
  let end: string | null = null;

  if (rangeMatch) {
    start = parseDate(rangeMatch[1]);
    end = parseDate(rangeMatch[2]);
  }

  return { start, end };
}

/**
 * Main parsing function
 * Tries to identify transaction lines and extract structured data
 */
export function parseTransactions(text: string, currency: string = "USD"): ParserResult {
  const lines = text.split("\n");
  const transactions: NormalizedTransaction[] = [];

  // Extract statement date range
  const dateRange = extractDateRange(text);

  // Find transaction lines
  // Pattern: date | description | debit/credit | balance
  const transactionLines: string[] = [];

  for (const line of lines) {
    // Skip header rows
    if (/^(\s)*(date|description|transaction|debit|credit|balance|amount)/i.test(line)) continue;
    if (/^(\s)*(account|statement|page|total)/i.test(line)) continue;
    if (line.trim().length === 0) continue;

    // Look for lines with dates and amounts
    if (/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(line) || /\d{1,2}\s+\w+\s+\d{4}/i.test(line)) {
      transactionLines.push(line);
    }
  }

  // Parse each transaction line
  for (const line of transactionLines) {
    const parts = line.split(/\s{2,}|\t+/); // Split on multiple spaces or tabs

    if (parts.length < 3) continue; // Need at least date, description, amount

    const dateStr = parts[0]?.trim();
    const description = parts.slice(1, -2).join(" ").trim() || "";
    const debitStr = parts[parts.length - 3]?.trim() || "";
    const creditStr = parts[parts.length - 2]?.trim() || "";
    const balanceStr = parts[parts.length - 1]?.trim() || "";

    const date = parseDate(dateStr);
    if (!date) continue; // Skip if no valid date

    const debit = parseAmount(debitStr);
    const credit = parseAmount(creditStr);
    const balance = parseAmount(balanceStr);

    // Determine if this is a debit or credit based on description or amount position
    let finalDebit: number | null = null;
    let finalCredit: number | null = null;

    if (debit && credit) {
      // Both are valid amounts - determine based on context
      finalDebit = debit;
      finalCredit = credit;
    } else if (debit || credit) {
      // Exactly one is an amount
      if (debit) finalDebit = debit;
      if (credit) finalCredit = credit;
    }

    // Skip if no amount extracted
    if (!finalDebit && !finalCredit) continue;

    transactions.push({
      id: uuid(),
      date,
      description: description || "Transaction",
      reference: "", // Will be empty unless parser extracts it
      debit: finalDebit,
      credit: finalCredit,
      balance: balance || null,
      currency: currency,
      category: null,
      confidence: 0.7, // Generic parser has moderate confidence
      needsReview: !finalDebit || !finalCredit || (balance === null && !finalDebit && !finalCredit), // Flag for manual review if ambiguous
    });
  }

  return {
    transactions,
    statementStart: dateRange.start,
    statementEnd: dateRange.end,
    currency,
  };
}
