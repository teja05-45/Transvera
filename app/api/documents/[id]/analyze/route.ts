import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { extractPdfText, hasUsableTextLayer, isPdfPasswordProtected } from "@/lib/services/pdf-extractor";
import { detectBank } from "@/lib/services/bank-detector";
import { parseTransactions } from "@/lib/services/parser";
import { validateTransactions } from "@/lib/services/validators";
import type { DocumentMeta } from "@/types";
import { deleteUploadedFile, getUploadedFilePath, getUploadMetadata } from "@/lib/services/file-store";
import { OcrDependencyError, ocrPdf, type OcrLine } from "@/lib/services/ocr";
import { saveDocumentDebug } from "@/lib/services/debug-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: documentId } = await params;
  const processingStartedAt = performance.now();

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
    const pdfExtractionStartedAt = performance.now();
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

    const pdfExtractionMs = performance.now() - pdfExtractionStartedAt;
    const nativeTextLength = extractionResult.text.length;
    let extractionMethod: "pdf-text" | "ocr" = "pdf-text";
    let ocrConfidence: number | null = null;
    let ocrLines: OcrLine[] = [];
    let ocrMs = 0;

    // Fall back to local OCR when the native text layer is absent or unusable.
    if (!hasUsableTextLayer(extractionResult)) {
      try {
        const ocrStartedAt = performance.now();
        const ocrResult = await ocrPdf(filePath);
        ocrMs = performance.now() - ocrStartedAt;
        extractionResult = {
          ...extractionResult,
          text: ocrResult.text,
          hasText: ocrResult.text.trim().length > 0,
          extractionMethod: "pdf-text",
          pageCount: ocrResult.pages,
        };
        extractionMethod = "ocr";
        ocrConfidence = ocrResult.confidence;
        ocrLines = ocrResult.lines;
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
    const parsingStartedAt = performance.now();
    const parserResult = parseTransactions(extractionResult.text, currency, ocrLines);
    const parsingMs = performance.now() - parsingStartedAt;
    const transactions = parserResult.transactions;

    // Validate transactions
    const validationStartedAt = performance.now();
    const validation = validateTransactions(transactions);
    const validationMs = performance.now() - validationStartedAt;

    // Combine results
    const allTransactions = [...validation.valid, ...validation.needsReview];

    if (process.env.NODE_ENV !== "production") {
      console.debug("LedgerFlow extraction trace", {
        documentId,
        pages: extractionResult.pageCount,
        nativeTextLength,
        ocrTextLength: extractionMethod === "ocr" ? extractionResult.text.length : 0,
        ocrConfidence,
        detectedBank: bankDetection.detected?.name || null,
        detectedCurrency: currency,
        statementStart: parserResult.statementStart,
        statementEnd: parserResult.statementEnd,
        candidateRows: parserResult.debug.candidateRows.length,
        normalizedTransactions: parserResult.transactions.length,
        validTransactions: validation.valid.length,
        reviewTransactions: validation.needsReview.length,
        savedTransactions: allTransactions.length,
        processingMs: Math.round(performance.now() - processingStartedAt),
        pdfExtractionMs: Math.round(pdfExtractionMs),
        ocrMs: Math.round(ocrMs || 0),
        parsingMs: Math.round(parsingMs),
        validationMs: Math.round(validationMs),
        databaseMs: 0,
        database: "not configured",
      });
    }

    saveDocumentDebug({
      documentId,
      ocrText: extractionResult.text,
      detectedBank: bankDetection.detected,
      detectedCurrency: currency,
      ocrConfidence,
      parser: parserResult.debug,
      transactions: allTransactions,
      validationErrors: validation.issues,
      savedTransactions: allTransactions.length,
      createdAt: new Date().toISOString(),
    });

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
        candidateRows: parserResult.debug.candidateRows.length,
        extractedTransactions: parserResult.debug.extractedTransactions,
        savedTransactions: allTransactions.length,
        processingMs: Math.round(performance.now() - processingStartedAt),
        pdfExtractionMs: Math.round(pdfExtractionMs),
        ocrMs: Math.round(ocrMs || 0),
        parsingMs: Math.round(parsingMs),
        validationMs: Math.round(validationMs),
        databaseMs: 0,
        apiResponseMs: Math.round(performance.now() - processingStartedAt),
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
