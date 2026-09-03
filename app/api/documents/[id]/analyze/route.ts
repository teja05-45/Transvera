import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { extractPdfText, hasUsableTextLayer, isPdfPasswordProtected } from "@/lib/services/pdf-extractor";
import { detectBank } from "@/lib/services/bank-detector";
import { parseTransactions } from "@/lib/services/parser";
import { validateTransactions } from "@/lib/services/validators";
import type { DocumentMeta } from "@/types";
import { deleteUploadedFile, getUploadedFilePath, getUploadMetadata } from "@/lib/services/file-store";
import { OcrDependencyError, ocrPdf } from "@/lib/services/ocr";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: documentId } = await params;

  try {
    // Get the uploaded file path
    const filePath = getUploadedFilePath(documentId);
    if (!filePath) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Read the file
    const pdfBuffer = await readFile(filePath);

    // Extract text from PDF
    let extractionResult;
    try {
      extractionResult = await extractPdfText(pdfBuffer);
    } catch (error) {
      if (isPdfPasswordProtected(error)) {
        deleteUploadedFile(documentId);
        return NextResponse.json(
          {
            error: "This PDF is password-protected. Unlock it and upload it again.",
            code: "PASSWORD_PROTECTED",
          },
          { status: 400 }
        );
      }
      if (error instanceof Error && error.message.includes("Invalid PDF")) {
        deleteUploadedFile(documentId);
        return NextResponse.json(
          {
            error: "That file isn't a valid PDF.",
            code: "INVALID_PDF",
          },
          { status: 400 }
        );
      }
      throw error;
    }

    let extractionMethod: "pdf-text" | "ocr" = "pdf-text";
    let ocrConfidence: number | null = null;

    // Fall back to local OCR when the native text layer is absent or unusable.
    if (!hasUsableTextLayer(extractionResult)) {
      try {
        const ocrResult = await ocrPdf(filePath);
        extractionResult = {
          ...extractionResult,
          text: ocrResult.text,
          hasText: ocrResult.text.trim().length > 0,
          extractionMethod: "pdf-text",
          pageCount: ocrResult.pages,
        };
        extractionMethod = "ocr";
        ocrConfidence = ocrResult.confidence;
      } catch (error) {
        if (error instanceof OcrDependencyError) {
          deleteUploadedFile(documentId);
          return NextResponse.json(
            {
              error: error.message,
              code: error.dependency === "tesseract" ? "TESSERACT_UNAVAILABLE" : "POPLER_UNAVAILABLE",
              needsOcr: true,
            },
            { status: 503 }
          );
        }
        deleteUploadedFile(documentId);
        return NextResponse.json(
          { error: "OCR could not read this document.", code: "OCR_FAILED" },
          { status: 422 }
        );
      }
    }

    // Detect bank
    const bankDetection = detectBank(extractionResult.text);

    // Infer currency from bank detection
    const currency = bankDetection.detected?.currency || "USD";

    // Parse transactions
    const parserResult = parseTransactions(extractionResult.text, currency);
    const transactions = ocrConfidence === null
      ? parserResult.transactions
      : parserResult.transactions.map((transaction) => ({
          ...transaction,
          confidence: Math.min(transaction.confidence, ocrConfidence / 100),
          needsReview: transaction.needsReview || ocrConfidence < 85,
        }));

    // Validate transactions
    const validation = validateTransactions(transactions);

    // Combine results
    const allTransactions = [...validation.valid, ...validation.needsReview];

    // Get upload metadata
    const uploadMeta = getUploadMetadata(documentId);

    // Build document metadata
    const meta: DocumentMeta = {
      filename: uploadMeta?.originalName || "statement.pdf",
      sizeBytes: uploadMeta?.sizeBytes || 0,
      pageCount: extractionResult.pageCount,
      isDemo: false,
      extractionMethod,
      ocrConfidence,
      bank: bankDetection.detected,
      statementStart: parserResult.statementStart,
      statementEnd: parserResult.statementEnd,
    };

    deleteUploadedFile(documentId);
    return NextResponse.json({
      success: true,
      documentId,
      meta,
      transactions: allTransactions,
      validationSummary: {
        total: allTransactions.length,
        valid: validation.valid.length,
        needsReview: validation.needsReview.length,
        issues: validation.issues,
      },
      extractionDetails: {
        pageCount: extractionResult.pageCount,
        textLength: extractionResult.text.length,
        hasText: extractionResult.hasText,
        extractionMethod,
        ocrConfidence,
        bankConfidence: bankDetection.detected?.confidence || 0,
      },
    });
  } catch (error) {
    deleteUploadedFile(documentId);
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json(
      {
        error: message,
        code: "ANALYSIS_ERROR",
      },
      { status: 500 }
    );
  }
}
