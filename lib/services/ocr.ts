import { execFile as execFileCallback } from "child_process";
import { access, mkdir, readdir, rm } from "fs/promises";
import { tmpdir } from "os";
import { delimiter, join } from "path";
import { promisify } from "util";

const execFile = promisify(execFileCallback);

export interface OcrProgress {
  stage: "preparing" | "reading" | "combining";
  page?: number;
  totalPages?: number;
}

export interface OcrResult {
  text: string;
  pages: number;
  confidence: number;
  method: "tesseract";
}

export class OcrDependencyError extends Error {
  constructor(public dependency: "tesseract" | "poppler") {
    super(
      dependency === "tesseract"
        ? "Scanned PDF detected, but Tesseract is not configured on this machine."
        : "PDF image rendering requires Poppler."
    );
    this.name = "OcrDependencyError";
  }
}

function candidatePaths(name: string, envName: string, defaults: string[]): string[] {
  const configured = process.env[envName];
  const pathEntries = (process.env.PATH || "").split(delimiter).filter(Boolean);
  return [
    ...(configured ? [configured] : []),
    ...pathEntries.map((entry) => join(entry, name)),
    ...defaults,
  ];
}

async function findExecutable(name: string, envName: string, defaults: string[]): Promise<string | null> {
  for (const candidate of candidatePaths(name, envName, defaults)) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue searching configured, PATH, and standard locations.
    }
  }
  return null;
}

export async function getOcrDependencies() {
  const tesseract = await findExecutable(
    process.platform === "win32" ? "tesseract.exe" : "tesseract",
    "TESSERACT_PATH",
    process.platform === "win32"
      ? ["C:\\Program Files\\Tesseract-OCR\\tesseract.exe", "C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe"]
      : []
  );
  const poppler = await findExecutable(
    process.platform === "win32" ? "pdftoppm.exe" : "pdftoppm",
    "POPPLER_PATH",
    process.platform === "win32"
      ? ["C:\\Program Files\\poppler\\Library\\bin\\pdftoppm.exe", "C:\\Program Files\\poppler\\bin\\pdftoppm.exe"]
      : []
  );
  return { tesseract, poppler };
}

function parseTsv(output: string): { text: string; confidence: number } {
  const lines = output.split(/\r?\n/).slice(1);
  const textLines = new Map<string, string[]>();
  const confidences: number[] = [];

  for (const line of lines) {
    const columns = line.split("\t");
    const word = columns[11]?.trim();
    const confidence = Number(columns[10]);
    const lineKey = columns.slice(1, 6).join(":");
    if (word) textLines.set(lineKey, [...(textLines.get(lineKey) || []), word]);
    if (Number.isFinite(confidence) && confidence >= 0) confidences.push(confidence);
  }

  return {
    text: Array.from(textLines.values()).map((words) => words.join(" ")).join("\n"),
    confidence: confidences.length
      ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length
      : 0,
  };
}

export async function ocrPdf(
  filePath: string,
  onProgress?: (progress: OcrProgress) => void,
  language = "eng"
): Promise<OcrResult> {
  const dependencies = await getOcrDependencies();
  if (!dependencies.tesseract) throw new OcrDependencyError("tesseract");
  if (!dependencies.poppler) throw new OcrDependencyError("poppler");

  const workDir = join(tmpdir(), `ledgerflow-ocr-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(workDir, { recursive: true });

  try {
    onProgress?.({ stage: "preparing" });
    const prefix = join(workDir, "page");
    await execFile(dependencies.poppler, ["-png", "-r", "200", filePath, prefix], { windowsHide: true, maxBuffer: 1024 * 1024 });
    const pageFiles = (await readdir(workDir))
      .filter((file) => /^page-\d+\.png$/i.test(file))
      .sort((left, right) => Number(left.match(/\d+/)?.[0]) - Number(right.match(/\d+/)?.[0]));

    if (!pageFiles.length) throw new Error("Poppler did not render any PDF pages.");

    const pageTexts: string[] = [];
    const pageConfidences: number[] = [];
    for (let index = 0; index < pageFiles.length; index += 1) {
      const page = index + 1;
      onProgress?.({ stage: "reading", page, totalPages: pageFiles.length });
      const { stdout } = await execFile(
        dependencies.tesseract,
        [join(workDir, pageFiles[index]), "stdout", "--psm", "6", "-l", language, "tsv"],
        { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
      );
      const parsed = parseTsv(stdout);
      pageTexts.push(parsed.text);
      pageConfidences.push(parsed.confidence);
    }

    onProgress?.({ stage: "combining" });
    return {
      text: pageTexts.join("\n"),
      pages: pageFiles.length,
      confidence: pageConfidences.reduce((sum, value) => sum + value, 0) / pageConfidences.length,
      method: "tesseract",
    };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
