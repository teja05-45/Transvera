"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Sparkles, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/cn";

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export interface UploadedFileInfo {
  file: File;
  name: string;
  sizeBytes: number;
}

interface Props {
  onFileAccepted: (info: UploadedFileInfo) => void;
  onUseSample: () => void;
  fileInfo: UploadedFileInfo | null;
  onClear: () => void;
  disabled?: boolean;
}

async function validatePdf(file: File): Promise<string | null> {
  if (file.type && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "That file doesn't appear to be a PDF. Please upload a .pdf statement.";
  }
  if (file.size === 0) {
    return "That file is empty. Please choose a valid PDF.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "This file is larger than 20MB. Try splitting the statement or contact support.";
  }
  // Real corruption / password-protection signal: check the PDF header magic bytes.
  const head = await file.slice(0, 5).text().catch(() => "");
  if (!head.startsWith("%PDF-")) {
    return "That file doesn't appear to be a valid PDF — the file header is missing or corrupted.";
  }
  return null;
}

export function FileUploader({ onFileAccepted, onUseSample, fileInfo, onClear, disabled }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = await validatePdf(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      onFileAccepted({ file, name: file.name, sizeBytes: file.size });
    },
    [onFileAccepted]
  );

  if (fileInfo) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-ledger-tint text-ledger-strong">
              <FileText size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-ink">{fileInfo.name}</p>
              <p className="text-xs text-ink-faint">{formatBytes(fileInfo.sizeBytes)}</p>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={onClear}
              aria-label="Remove file"
              className="shrink-0 rounded-full p-1.5 text-ink-faint hover:bg-rule/50 hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-14 text-center transition-colors",
          isDragging ? "border-ledger bg-ledger-tint/40" : "border-rule-strong bg-paper-raised hover:border-ink-soft"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ledger-tint text-ledger-strong">
          <UploadCloud size={22} />
        </div>
        <div>
          <p className="font-medium text-ink">Drag a statement PDF here</p>
          <p className="mt-1 text-sm text-ink-faint">or click to choose a file · PDF, up to 20MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-[var(--radius-md)] bg-error-tint px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <button
        onClick={onUseSample}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-rule px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-ledger hover:text-ledger-strong"
      >
        <Sparkles size={15} />
        Try a sample statement instead
      </button>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
