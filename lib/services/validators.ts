/**
 * Transaction Validation Service
 * Validates extracted transactions and flags issues
 */

import type { NormalizedTransaction } from "@/types";

export interface ValidationIssue {
  type: "low-confidence" | "duplicate" | "malformed-amount" | "missing-data" | "date-parse-error";
  message: string;
  transactionId?: string;
}

export interface ValidationResult {
  valid: NormalizedTransaction[];
  needsReview: NormalizedTransaction[];
  issues: ValidationIssue[];
}

/**
 * Validate all transactions
 */
export function validateTransactions(transactions: NormalizedTransaction[]): ValidationResult {
  const valid: NormalizedTransaction[] = [];
  const needsReview: NormalizedTransaction[] = [];
  const issues: ValidationIssue[] = [];

  // Track seen transactions for duplicate detection
  const seen = new Set<string>();

  for (const tx of transactions) {
    let hasIssues = false;
    const txIssues: ValidationIssue[] = [];

    // Check for low confidence
    if (tx.confidence < 0.7) {
      hasIssues = true;
      txIssues.push({
        type: "low-confidence",
        message: `Low confidence (${(tx.confidence * 100).toFixed(0)}%)`,
        transactionId: tx.id,
      });
    }

    // Check for missing critical data
    if (!tx.date || !tx.description) {
      hasIssues = true;
      txIssues.push({
        type: "missing-data",
        message: "Missing date or description",
        transactionId: tx.id,
      });
    }

    // Check for valid date format
    if (tx.date && !/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) {
      hasIssues = true;
      txIssues.push({
        type: "date-parse-error",
        message: "Invalid date format",
        transactionId: tx.id,
      });
    }

    // Check for valid amount
    if (tx.debit === null && tx.credit === null) {
      hasIssues = true;
      txIssues.push({
        type: "malformed-amount",
        message: "Missing both debit and credit amount",
        transactionId: tx.id,
      });
    }

    // Check for suspicious balances (should generally increase/decrease monotonically)
    if (tx.balance !== null && (tx.balance < -1000000 || tx.balance > 1000000000)) {
      hasIssues = true;
      txIssues.push({
        type: "malformed-amount",
        message: "Unusual balance amount",
        transactionId: tx.id,
      });
    }

    // Check for duplicate transactions (same date, description, amount within 5 minutes)
    const txKey = `${tx.date}|${tx.description}|${tx.debit}|${tx.credit}`;
    if (seen.has(txKey)) {
      hasIssues = true;
      txIssues.push({
        type: "duplicate",
        message: "Possible duplicate transaction",
        transactionId: tx.id,
      });
    }
    seen.add(txKey);

    // Add transaction to appropriate bucket
    if (hasIssues || tx.needsReview) {
      const updated = {
        ...tx,
        needsReview: true,
      };
      needsReview.push(updated);
      issues.push(...txIssues);
    } else {
      valid.push(tx);
    }
  }

  return {
    valid,
    needsReview,
    issues,
  };
}

/**
 * Calculate summary statistics
 */
export function calculateSummary(transactions: NormalizedTransaction[]) {
  const valid = transactions.filter((t) => !t.needsReview).length;
  const needsReview = transactions.filter((t) => t.needsReview).length;
  const totalDebit = transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
  const totalCredit = transactions.reduce((sum, t) => sum + (t.credit || 0), 0);

  return {
    total: transactions.length,
    valid,
    needsReview,
    totalDebit: Math.round(totalDebit * 100) / 100,
    totalCredit: Math.round(totalCredit * 100) / 100,
    net: Math.round((totalCredit - totalDebit) * 100) / 100,
  };
}
