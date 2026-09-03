/**
 * PDF Text Extraction Service
 * Extracts text from PDF files using pdf-parse
 */

import PDFParser from "pdf-parse";

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
  hasText: boolean;
  extractionMethod: "pdf-text";
  metadata?: {
    producer?: string;
    creator?: string;
  };
}

/**
 * Extract text from a PDF buffer
 */
export async function extractPdfText(pdfBuffer: Buffer): Promise<PdfExtractionResult> {
  try {
    const data = await PDFParser(pdfBuffer);
    
    // Combine text from all pages
    const text = data.text || "";
    const hasText = text.trim().length > 100; // Need meaningful text
    
    return {
      text,
      pageCount: data.numpages || 0,
      hasText,
      extractionMethod: "pdf-text",
      metadata: {
        producer: data.info?.Producer,
        creator: data.info?.Creator,
      },
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Check if PDF appears to be password-protected
 */
export function isPdfPasswordProtected(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("password") || message.includes("encrypted") || message.includes("security");
}

/**
 * Check if extracted text is meaningful enough to proceed
 * Returns false if PDF appears to be scanned/image-based (needs OCR)
 */
export function hasUsableTextLayer(result: PdfExtractionResult): boolean {
  // Look for common text patterns (dates, numbers, account info)
  const textLower = result.text.toLowerCase();
  
  // Look for common statement patterns
  const hasAccountPattern = /account|statement|transaction|balance/.test(textLower);
  const hasDatePattern = /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(result.text);
  const hasNumberPattern = /\d+[\.,]\d{2}/.test(result.text); // Currency amounts
  
  // Must have decent length and some structured patterns
  const minTextLength = 100;
  const hasMinLength = result.text.trim().length >= minTextLength;
  const alphaNumericCount = (result.text.match(/[A-Za-z0-9]/g) || []).length;
  const hasUsefulContent = alphaNumericCount >= 40 && (hasDatePattern || hasNumberPattern);
  
  return hasMinLength && hasUsefulContent && (hasAccountPattern || (hasDatePattern && hasNumberPattern));
}
