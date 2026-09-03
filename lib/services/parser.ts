/**
 * Generic Transaction Parser
 * Extracts transaction data from bank statement text
 * Supports common formats with Date, Description, Debit, Credit, Balance columns
 */

import type { FinancialEvidence, NormalizedTransaction } from "@/types";
import type { OcrLine } from "./ocr";
import { v4 as uuid } from "uuid";

export interface ParserResult {
  transactions: NormalizedTransaction[];
  statementStart: string | null;
  statementEnd: string | null;
  currency: string;
  debug: {
    rawText: string;
    normalizedText: string;
    detectedDates: string[];
    candidateRows: string[];
    rejectedLines: string[];
    detectedHeaders: string[];
    extractedTransactions: number;
    dateAnchors: number;
    discardedCandidates: { rawText: string; reason: string }[];
  };
}

/**
 * Parse dates in various formats
 */
function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim().length === 0) return null;

  // Remove whitespace
  dateStr = dateStr.trim().replace(/[|,]+$/g, "");

  // Try ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const compactMatch = dateStr.match(/^(\d{2})(\d{2})[./-]?(\d{2}|\d{4})$/);
  if (compactMatch) {
    const day = Number(compactMatch[1]);
    const month = Number(compactMatch[2]);
    let year = compactMatch[3];
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      if (year.length === 2) year = `${Number(year) > 50 ? 19 : 20}${year}`;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }

  // Try DD/MM/YYYY, DD-MM-YYYY
  const dmyMatch = dateStr.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (dmyMatch) {
    let day = dmyMatch[1];
    let month = dmyMatch[2];
    let year = dmyMatch[3];

    if (Number(day) <= 12 && Number(month) > 12) {
      [day, month] = [month, day];
    }

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

function repairDateToken(token: string): string | null {
  const repaired = token
    .trim()
    .replace(/[OoQq]/g, "0")
    .replace(/[IiLl|]/g, "1")
    .replace(/[Ss]/g, "5")
    .replace(/[Bb]/g, "8")
    .replace(/[vV]/g, "/")
    .replace(/[_,]/g, "/");
  return parseDate(repaired);
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
    /(?:from|period|for)[:\s\-]*(\d{1,2}\s+\w+\s+\d{2,4}|\d{1,2}[./-]\d{1,2}[./-]\d{2,4}).{0,50}?(?:to|through|thru|\-).{0,10}(\d{1,2}\s+\w+\s+\d{2,4}|\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i
  );

  let start: string | null = null;
  let end: string | null = null;

  if (rangeMatch) {
    start = parseDate(rangeMatch[1]);
    end = parseDate(rangeMatch[2]);
  }

  if (!start || !end) {
    const fromIndex = text.search(/\b(?:from|fr0m)\b\s*[:=-]?/i);
    const toIndex = fromIndex >= 0 ? text.slice(fromIndex + 4).search(/\b(?:to|t0)\b\s*[:=-]?/i) : -1;
    if (fromIndex >= 0 && toIndex >= 0) {
      const fromText = text.slice(fromIndex, fromIndex + 4 + toIndex);
      const fromTokens = fromText.match(/[A-Za-z0-9][A-Za-z0-9./_-]{4,14}/g) || [];
      const toText = text.slice(fromIndex + toIndex + 4, fromIndex + toIndex + 90);
      const toTokens = toText.match(/[A-Za-z0-9][A-Za-z0-9./_-]{4,14}/g) || [];
      start = fromTokens.map((token) => parseDate(token) || repairDateToken(token)).find(Boolean) || null;
      end = toTokens.map((token) => parseDate(token) || repairDateToken(token)).find(Boolean) || null;
    }
  }

  return { start, end };
}

export function normalizeOcrText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

const dateAtStart = /^([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}\d{2}[./-]?\d{2,4}|[0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4}|[0-9]{1,2}\s+[A-Za-z]{3,9}\s+[0-9]{2,4})\b/;
const amountPattern = /(?:₹|INR|[$£€¥])?\s*\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|(?:₹|INR|[$£€¥])?\s*\d+\.\d{1,2}|(?:₹|INR|[$£€¥])?\s*\d{4,}/gi;

function leadingDate(line: string): { raw: string; date: string | null; rest: string } | null {
  const match = line.match(dateAtStart);
  const rawToken = match?.[1] || line.match(/^[A-Za-z0-9|OoQqIiLlSsBbvV._/-]{3,12}/)?.[0];
  if (!rawToken) return null;
  const date = parseDate(rawToken) || repairDateToken(rawToken);
  if (!date && !/\d/.test(rawToken) && !/[OoIiLlSsBb]/.test(rawToken)) return null;
  return { raw: rawToken, date, rest: line.slice(rawToken.length).replace(/^[|\s]+/, "") };
}

function isTransactionAnchor(line: string): boolean {
  const anchor = leadingDate(line);
  if (!anchor) return false;
  if (anchor.date) return true;
  const raw = anchor.raw;
  const body = anchor.rest;
  const dateLikeStart = /^\d/.test(raw) || /^[Oo]/.test(raw);
  const hasDateShape = /^\d|[./-]/.test(raw) || /[./-]/.test(raw);
  const hasAmount = amountPattern.test(body);
  amountPattern.lastIndex = 0;
  const hasTransactionWord = /\b(?:neft|imps|upi|debit|credit|withdrawal|deposit|payment|charges?|tax|cap\w*|div\w*|bill|ach|interest)\b/i.test(body);
  return (dateLikeStart && (hasDateShape || hasTransactionWord) && (hasAmount || hasTransactionWord)) ||
    (hasTransactionWord && hasAmount);
}

function parseRow(block: string[], currency: string, sourceLines?: OcrLine[]): NormalizedTransaction {
  const first = leadingDate(block[0]);
  if (!first) throw new Error("Candidate has no row anchor");
  const evidenceLines = sourceLines || [];
  const body = [first.rest, ...block.slice(1)].join(" ").replace(/\s+/g, " ").trim();
  const amountMatches = [...body.matchAll(amountPattern)];
  const amounts = amountMatches.map((match) => parseAmount(match[0])).filter((amount): amount is number => amount !== null);
  const rawText = block.join(" ");
  const sourceConfidence = evidenceLines.length
    ? Math.min(...evidenceLines.flatMap((line) => line.words.map((word) => word.confidence)).filter((confidence) => confidence >= 0), 100) / 100
    : 0;
  const financialEvidence: FinancialEvidence[] = amountMatches.map((match) => ({
    rawOCRValue: match[0],
    normalizedValue: parseAmount(match[0]),
    confidence: sourceConfidence,
    needsReview: sourceConfidence < 0.85,
    sourcePage: evidenceLines[0]?.page,
  }));

  const directionText = body.toLowerCase();
  const isCredit = /\b(cr|credit|deposit|received)\b/.test(directionText);
  const isDebit = /\b(dr|debit|withdrawal|withdrawn|payment|charges?|tax)\b/.test(directionText);
  const balance = amounts.length >= 2 ? amounts[amounts.length - 1] : null;
  const transactionAmount = amounts.length >= 2 ? amounts[amounts.length - 2] : amounts[0] ?? null;
  const description = body
    .replace(amountPattern, " ")
    .replace(/\s+/g, " ")
    .replace(/[|]+/g, " ")
    .trim();
  const referenceMatch = description.match(/\b(?:ref(?:erence)?|txn|utr|neft|imps|upi)[\s:#-]*([A-Z0-9][A-Z0-9/-]{3,})\b/i);
  const reference = referenceMatch?.[1] || "";
  const directionKnown = isCredit !== isDebit;
  const confidence = Math.min(0.95, 0.35 + 0.2 + (description ? 0.15 : 0) + (balance !== null ? 0.15 : 0) + (directionKnown ? 0.15 : 0));

  return {
    id: uuid(),
    date: first.date,
    description: description || "Transaction",
    reference,
    debit: directionKnown && !isCredit ? transactionAmount : null,
    credit: directionKnown && isCredit ? transactionAmount : null,
    balance,
    currency,
    category: null,
    confidence,
    needsReview: !directionKnown || balance === null || confidence < 0.7 || first.date === null || !amounts.length,
    rawText,
    sourcePage: sourceLines?.[0]?.page,
    sourceLineStart: sourceLines?.[0]?.line,
    sourceLineEnd: sourceLines?.[sourceLines.length - 1]?.line,
    sourceBoundingBox: sourceLines?.length ? boundingBox(sourceLines) : undefined,
    financialEvidence,
  };
}

function boundingBox(lines: OcrLine[]) {
  const words = lines.flatMap((line) => line.words);
  if (!words.length) return undefined;
  const x = Math.min(...words.map((word) => word.x));
  const y = Math.min(...words.map((word) => word.y));
  const right = Math.max(...words.map((word) => word.x + word.width));
  const bottom = Math.max(...words.map((word) => word.y + word.height));
  return { x, y, width: right - x, height: bottom - y };
}

/**
 * Main parsing function
 * Tries to identify transaction lines and extract structured data
 */
export function parseTransactions(text: string, currency: string = "USD", sourceLines: OcrLine[] = []): ParserResult {
  const normalizedText = normalizeOcrText(text);
  const lines = normalizedText.split("\n");
  const transactions: NormalizedTransaction[] = [];

  // Extract statement date range
  const dateRange = extractDateRange(text);

  // Find transaction lines
  // Pattern: date | description | debit/credit | balance
  const candidateRows: string[] = [];
  const rejectedLines: string[] = [];
  const discardedCandidates: { rawText: string; reason: string }[] = [];
  const detectedHeaders = lines.filter((line) => /\b(date|value date|transaction|narration|description|particular|reference|debit|credit|withdrawal|deposit|amount|balance)\b/i.test(line));
  const blocks: string[][] = [];
  let current: string[] = [];
  let inTable = false;
  for (const line of lines) {
    if (/\bdate\b.*\b(?:narration|description|particular|balance)\b/i.test(line)) {
      inTable = true;
      continue;
    }
    if (/statement\s+of\s+account/i.test(line)) {
      inTable = true;
      continue;
    }
    if (/^(date|description|transaction|debit|credit|balance|amount|account|statement|page|total)\b/i.test(line)) continue;
    if (inTable && isTransactionAnchor(line)) {
      if (current.length) blocks.push(current);
      current = [line];
      candidateRows.push(line);
    } else if (current.length) {
      current.push(line);
    } else if (/\d|[OoIiLlSsBb]/.test(line)) {
      rejectedLines.push(line);
    }
  }
  if (current.length) blocks.push(current);
  for (const block of blocks) {
    const firstLineIndex = lines.indexOf(block[0]);
    const matchingLines = sourceLines.filter((line) => line.text === block[0] || (line.line >= firstLineIndex && line.line <= firstLineIndex + block.length));
    try {
      transactions.push(parseRow(block, currency, matchingLines));
    } catch (error) {
      discardedCandidates.push({ rawText: block.join(" "), reason: error instanceof Error ? error.message : "Unknown parse error" });
    }
  }

  return {
    transactions,
    statementStart: dateRange.start,
    statementEnd: dateRange.end,
    currency,
    debug: {
      rawText: text,
      normalizedText,
      detectedDates: transactions.map((transaction) => transaction.date).filter((date): date is string => date !== null),
      candidateRows,
      rejectedLines,
      detectedHeaders,
      extractedTransactions: transactions.length,
      dateAnchors: candidateRows.length,
      discardedCandidates,
    },
  };
}
