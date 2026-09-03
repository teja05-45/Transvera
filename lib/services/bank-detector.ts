/**
 * Bank Detection Service
 * Identifies bank from extracted text
 */

import type { DetectedBank } from "@/types";

// Common bank patterns and their metadata
const BANK_PATTERNS: Array<{
  regex: RegExp;
  name: string;
  country: string;
  currency: string;
}> = [
  {
    regex: /HDFC\s+BANK|hdfc\.com|hdfc\s+net\s+banking/i,
    name: "HDFC Bank",
    country: "India",
    currency: "INR",
  },
  {
    regex: /ICICI\s+BANK|icici\.com|icici\s+net\s+banking/i,
    name: "ICICI Bank",
    country: "India",
    currency: "INR",
  },
  {
    regex: /STATE\s+BANK|SBI|sbi\.co\.in/i,
    name: "State Bank of India",
    country: "India",
    currency: "INR",
  },
  {
    regex: /AXIS\s+BANK|axis\.com|axis\s+net\s+banking/i,
    name: "Axis Bank",
    country: "India",
    currency: "INR",
  },
  {
    regex: /CHASE|JPMorgan|chase\.com/i,
    name: "Chase Bank",
    country: "United States",
    currency: "USD",
  },
  {
    regex: /BANK\s+OF\s+AMERICA|BOFA|bankofamerica\.com/i,
    name: "Bank of America",
    country: "United States",
    currency: "USD",
  },
  {
    regex: /WELLS\s+FARGO|wellsfargo\.com/i,
    name: "Wells Fargo",
    country: "United States",
    currency: "USD",
  },
  {
    regex: /CITIBANK|CITI\s+BANK|citibank\.com/i,
    name: "Citibank",
    country: "United States",
    currency: "USD",
  },
  {
    regex: /BARCLAYS|barclays\.com/i,
    name: "Barclays",
    country: "United Kingdom",
    currency: "GBP",
  },
  {
    regex: /HSBC|hsbc\.com/i,
    name: "HSBC",
    country: "United Kingdom",
    currency: "GBP",
  },
  {
    regex: /RBC|Royal\s+Bank\s+of\s+Canada|rbc\.com/i,
    name: "RBC",
    country: "Canada",
    currency: "CAD",
  },
  {
    regex: /SCOTIABANK|scotiabank\.com/i,
    name: "Scotiabank",
    country: "Canada",
    currency: "CAD",
  },
];

export interface BankDetectionResult {
  detected: DetectedBank | null;
  confidence: number;
}

/**
 * Detect bank from extracted PDF text
 */
export function detectBank(text: string): BankDetectionResult {
  if (!text || text.trim().length === 0) {
    return { detected: null, confidence: 0 };
  }

  // Look for bank patterns
  for (const pattern of BANK_PATTERNS) {
    if (pattern.regex.test(text)) {
      return {
        detected: {
          name: pattern.name,
          country: pattern.country,
          currency: pattern.currency,
          confidence: 0.9, // High confidence for exact pattern match
        },
        confidence: 0.9,
      };
    }
  }

  // Check for currency hints (to infer bank location at least)
  const currencyPatterns: Array<{
    regex: RegExp;
    currency: string;
    country: string;
  }> = [
    { regex: /₹|INR|indian\s+rupee/i, currency: "INR", country: "India" },
    { regex: /\$|USD|us\s+dollar/i, currency: "USD", country: "United States" },
    { regex: /£|GBP|british\s+pound/i, currency: "GBP", country: "United Kingdom" },
    { regex: /€|EUR|euro/i, currency: "EUR", country: "Europe" },
    { regex: /C\$|CAD|canadian\s+dollar/i, currency: "CAD", country: "Canada" },
    { regex: /A\$|AUD|australian\s+dollar/i, currency: "AUD", country: "Australia" },
  ];

  for (const pattern of currencyPatterns) {
    if (pattern.regex.test(text)) {
      return {
        detected: {
          name: "Unknown",
          country: pattern.country,
          currency: pattern.currency,
          confidence: 0.4, // Low confidence - only currency detected
        },
        confidence: 0.4,
      };
    }
  }

  // No specific bank or currency detected
  return {
    detected: {
      name: "Unknown",
      country: "Unknown",
      currency: "USD", // Default
      confidence: 0.0,
    },
    confidence: 0.0,
  };
}
