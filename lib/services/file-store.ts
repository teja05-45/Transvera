/**
 * Uploaded Files Store
 * Manages temporary storage of uploaded PDF files during processing
 */

import { writeFile, mkdir } from "fs/promises";
import { unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export interface UploadedFileMetadata {
  path: string;
  originalName: string;
  uploadedAt: Date;
  sizeBytes: number;
}

// Simple in-memory store for uploaded files (resets on server restart)
// In production, use persistent storage like S3 or database
const uploadedFiles = new Map<string, UploadedFileMetadata>();

/**
 * Store a file in temporary storage
 */
export async function storeUploadedFile(
  documentId: string,
  fileBuffer: Buffer,
  originalName: string,
  sizeBytes: number
): Promise<string> {
  const tempDir = join(tmpdir(), "ledgerflow-uploads");
  await mkdir(tempDir, { recursive: true });

  const filePath = join(tempDir, `${documentId}.pdf`);
  await writeFile(filePath, fileBuffer);

  uploadedFiles.set(documentId, {
    path: filePath,
    originalName,
    uploadedAt: new Date(),
    sizeBytes,
  });

  return filePath;
}

/**
 * Get the path to an uploaded file
 */
export function getUploadedFilePath(documentId: string): string | null {
  const meta = uploadedFiles.get(documentId);
  return meta?.path ?? null;
}

/**
 * Get upload metadata
 */
export function getUploadMetadata(documentId: string): UploadedFileMetadata | null {
  return uploadedFiles.get(documentId) ?? null;
}

/**
 * Clean up a stored file
 */
export function deleteUploadedFile(documentId: string): void {
  const meta = uploadedFiles.get(documentId);
  uploadedFiles.delete(documentId);
  if (meta) {
    try {
      unlinkSync(meta.path);
    } catch {
      // The file may already have been removed by the OS temp cleanup.
    }
  }
}
