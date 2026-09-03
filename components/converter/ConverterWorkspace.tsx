"use client";

import { useRef, useState } from "react";
import { Info } from "lucide-react";
import type { ConverterDefinition, DocumentMeta, NormalizedTransaction, ProcessingStepState } from "@/types";
import { FileUploader, type UploadedFileInfo } from "./FileUploader";
import { ProcessingStatus } from "./ProcessingStatus";
import { BankDetectionPanel } from "./BankDetectionPanel";
import { ValidationSummary } from "./ValidationSummary";
import { TransactionTable } from "./TransactionTable";
import { ExportPanel } from "./ExportPanel";
import { demoDocumentMeta, demoTransactions } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";

type Stage = "idle" | "processing" | "backend-unavailable" | "review";

const stageSequence: { stage: ProcessingStepState["stage"]; label: string; ms: number }[] = [
  { stage: "uploading", label: "Uploading document", ms: 500 },
  { stage: "analyzing", label: "Analyzing document", ms: 650 },
  { stage: "detecting-bank", label: "Detecting bank", ms: 700 },
  { stage: "extracting", label: "Extracting transactions", ms: 900 },
  { stage: "validating", label: "Validating transactions", ms: 500 },
];

export function ConverterWorkspace({ converter }: { converter: ConverterDefinition }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>(null);
  const [steps, setSteps] = useState<ProcessingStepState[]>([]);
  const [meta, setMeta] = useState<DocumentMeta | null>(null);
  const [transactions, setTransactions] = useState<NormalizedTransaction[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  function runPipeline(isDemo: boolean) {
    setSteps(
      stageSequence.map((s, i) => ({
        stage: s.stage,
        label: s.label,
        status: i === 0 ? "active" : "pending",
      }))
    );
    setStage("processing");

    let elapsed = 0;
    stageSequence.forEach((s, i) => {
      elapsed += s.ms;
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((p, idx) => {
            if (idx < i) return { ...p, status: "complete" };
            if (idx === i) return { ...p, status: "complete" };
            if (idx === i + 1) return { ...p, status: "active" };
            return p;
          })
        );

        if (i === stageSequence.length - 1) {
          if (isDemo) {
            setMeta(demoDocumentMeta);
            setTransactions(demoTransactions);
            setStage("review");
          } else {
            // Honest boundary: this preview build has a real, validated
            // upload path but no configured OCR/bank-parsing backend, so
            // real extraction can't happen yet. We say so rather than
            // fabricating transactions from a real file we didn't parse.
            setStage("backend-unavailable");
          }
        }
      }, elapsed);
    });
  }

  function handleFileAccepted(info: UploadedFileInfo) {
    setFileInfo(info);
  }

  async function handleAnalyze() {
    if (!fileInfo) return;
    await analyzeRealPdf(fileInfo);
  }

  async function analyzeRealPdf(info: UploadedFileInfo) {
    setSteps(
      stageSequence.map((s, i) => ({
        stage: s.stage,
        label: s.label,
        status: i === 0 ? "active" : "pending",
      }))
    );
    setStage("processing");

    try {
      // Step 1: Upload file
      setSteps((prev) =>
        prev.map((p, i) => ({
          ...p,
          status: i === 0 ? "complete" : i === 1 ? "active" : "pending",
        }))
      );

      // Upload the PDF
      const formData = new FormData();
      formData.append("file", info.file);

      const uploadRes = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        setErrorMessage(error.error || "Failed to upload document. Please try again.");
        setErrorCode(error.code || "UPLOAD_ERROR");
        setStage("backend-unavailable");
        console.error("Upload failed:", error);
        return;
      }

      const uploadData = await uploadRes.json();
      const documentId = uploadData.documentId;

      // Native extraction, OCR fallback, parsing, and validation run here.
      setSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          status: index < 1 ? "complete" : index === 1 ? "active" : "pending",
        }))
      );
      const analyzeRes = await fetch(`/api/documents/${documentId}/analyze`, {
        method: "POST",
      });

      if (!analyzeRes.ok) {
        const error = await analyzeRes.json();
        setErrorMessage(error.error || "Failed to analyze document.");
        setErrorCode(error.code || "UNKNOWN");
        console.warn("Document analysis response:", error);
        setSteps((prev) => prev.map((step, index) => ({
          ...step,
          status: index === 1 ? "complete" : index > 1 ? "error" : step.status,
        })));

        // Show specific error messages
        if (error.code === "PASSWORD_PROTECTED") {
          setStage("backend-unavailable");
          setErrorMessage("This PDF is password-protected. Please unlock it and try again.");
          return;
        }
        if (error.code === "OCR_REQUIRED") {
          setStage("backend-unavailable");
          setErrorMessage("Scanned PDF detected, but OCR is not configured on this machine.");
          return;
        }
        if (error.code === "TESSERACT_UNAVAILABLE") {
          setStage("backend-unavailable");
          setErrorMessage("Scanned PDF detected, but Tesseract is not configured on this machine. Install Tesseract OCR and try again.");
          return;
        }
        if (error.code === "POPLER_UNAVAILABLE") {
          setStage("backend-unavailable");
          setErrorMessage("PDF image rendering requires Poppler. Install Poppler and try again.");
          return;
        }
        if (error.code === "OCR_FAILED") {
          setStage("backend-unavailable");
          setErrorMessage("OCR could not read this document. Try again or upload another document.");
          return;
        }

        setStage("backend-unavailable");
        return;
      }

      const analysisData = await analyzeRes.json();

      if (analysisData.success) {
        setSteps((prev) => prev.map((step) => ({ ...step, status: "complete" })));
        setMeta(analysisData.meta);
        setTransactions(analysisData.transactions);
        setStage("review");
      } else {
        console.error("Analysis failed:", analysisData);
        setStage("backend-unavailable");
      }
    } catch (error) {
      console.error("Pipeline error:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(message);
      setErrorCode("PIPELINE_ERROR");
      setStage("backend-unavailable");
    }
  }

  function handleUseSample() {
    setFileInfo({ file: new File([], demoDocumentMeta.filename), name: demoDocumentMeta.filename, sizeBytes: demoDocumentMeta.sizeBytes });
    runPipeline(true);
  }

  function reset() {
    setStage("idle");
    setErrorMessage("");
    setErrorCode("");
    setFileInfo(null);
    setSteps([]);
    setMeta(null);
    setTransactions([]);
  }

  const validation = transactions.length
    ? {
        total: transactions.length,
        valid: transactions.filter((t) => !t.needsReview).length,
        needsReview: transactions.filter((t) => t.needsReview).length,
        issues: [],
      }
    : null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        {stage === "idle" && (
          <FileUploader
            fileInfo={fileInfo}
            onFileAccepted={handleFileAccepted}
            onUseSample={handleUseSample}
            onClear={() => setFileInfo(null)}
          />
        )}

        {stage === "idle" && fileInfo && (
          <Button onClick={handleAnalyze} size="lg" className="self-start">
            Analyze document
          </Button>
        )}

        {stage === "processing" && <ProcessingStatus steps={steps} />}

        {stage === "backend-unavailable" && (
          <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6">
            <div className="flex gap-3">
              <Info size={18} className="mt-0.5 shrink-0 text-ink-soft" />
              <div>
                  <p className="text-sm font-medium text-ink">
                    {errorCode === "PASSWORD_PROTECTED"
                      ? "Password-Protected PDF"
                      : errorCode === "OCR_REQUIRED"
                      ? "Scanned Document (OCR Required)"
                      : errorCode === "INVALID_PDF"
                      ? "Invalid PDF File"
                      : errorCode === "TESSERACT_UNAVAILABLE" || errorCode === "POPLER_UNAVAILABLE"
                      ? "OCR setup required"
                      : "We encountered an issue processing your document"}
                  </p>
                  <p className="mt-1.5 max-w-[56ch] text-sm leading-relaxed text-ink-soft">
                    {errorCode === "PASSWORD_PROTECTED"
                      ? "This PDF is password-protected. Please remove the password protection and try again."
                      : errorCode === "OCR_REQUIRED"
                      ? "Scanned PDF detected, but OCR is not configured on this machine. Install Tesseract OCR and Poppler, then try again."
                      : errorCode === "INVALID_PDF"
                      ? "The file you uploaded is not a valid PDF. Please check the file and try again."
                      : errorMessage || "The document may be password-protected, scanned without a text layer (requiring OCR), or in an unsupported format. Try uploading a different statement or using a text-based PDF."}
                  </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(errorCode === "TESSERACT_UNAVAILABLE" || errorCode === "POPLER_UNAVAILABLE") && (
                    <a
                      href="https://github.com/UB-Mannheim/tesseract/wiki"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-md bg-ledger px-3 py-2 text-sm font-medium text-paper hover:bg-ledger-strong"
                    >
                      View OCR Setup
                    </a>
                  )}
                  <Button onClick={handleUseSample} size="sm">
                    See the full flow with a sample statement
                  </Button>
                  <Button onClick={reset} variant="secondary" size="sm">
                    Try another PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "review" && meta && (
          <>
            <BankDetectionPanel meta={meta} transactionCount={transactions.length} />
            {validation && (
              <ValidationSummary
                summary={validation}
                onReviewIssues={() => tableRef.current?.scrollIntoView({ behavior: "smooth" })}
              />
            )}
            <div ref={tableRef}>
              <TransactionTable transactions={transactions} onChange={setTransactions} />
            </div>
            <ExportPanel converter={converter} transactions={transactions} meta={meta} />
            <button onClick={reset} className="self-start text-sm font-medium text-ink-soft hover:text-ink">
              Start another conversion
            </button>
          </>
        )}
      </div>

      <aside className="flex flex-col gap-4">
        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
          <p className="text-sm font-medium text-ink">About this converter</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{converter.longDescription}</p>
          <p className="mt-3 text-xs text-ink-faint">Best for: {converter.bestFor}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper p-5">
          <p className="text-sm font-medium text-ink">Privacy</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Files are processed for this conversion only. You can delete an
            uploaded document and its data at any time from your dashboard.
          </p>
        </div>
      </aside>
    </div>
  );
}
