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
  selectedPass: "fast" | "fallback" | "enhanced";
  lines: OcrLine[];
}

export interface OcrWord {
  text: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrLine {
  page: number;
  line: number;
  text: string;
  confidence: number;
  words: OcrWord[];
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
  const imagemagick = await findExecutable(
    process.platform === "win32" ? "magick.exe" : "magick",
    "IMAGEMAGICK_PATH",
    process.platform === "win32" ? ["C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe"] : []
  );
  return { tesseract, poppler, imagemagick };
}

function parseTsv(output: string, page: number): { text: string; confidence: number; lines: OcrLine[] } {
  const inputLines = output.split(/\r?\n/).slice(1);
  const textLines = new Map<string, string[]>();
  const confidences: number[] = [];
  const lineWords = new Map<string, OcrWord[]>();

  for (const line of inputLines) {
    const columns = line.split("\t");
    const word = columns[11]?.trim();
    const confidence = Number(columns[10]);
    const lineKey = columns.slice(1, 5).join(":");
    if (word) textLines.set(lineKey, [...(textLines.get(lineKey) || []), word]);
    if (word) {
      const key = `${columns[1]}:${columns[2]}:${columns[3]}:${columns[4]}`;
      lineWords.set(key, [...(lineWords.get(key) || []), {
        text: word,
        confidence,
        x: Number(columns[6]) || 0,
        y: Number(columns[7]) || 0,
        width: Number(columns[8]) || 0,
        height: Number(columns[9]) || 0,
      }]);
    }
    if (Number.isFinite(confidence) && confidence >= 0) confidences.push(confidence);
  }

  const ocrLines = Array.from(textLines.entries()).map(([key, words], index) => ({
    page,
    line: index + 1,
    text: words.join(" "),
    confidence: lineWords.get(key)?.reduce((sum, item) => sum + item.confidence, 0) || 0,
    words: lineWords.get(key) || [],
  }));
  return {
    text: Array.from(textLines.values()).map((words) => words.join(" ")).join("\n"),
    confidence: confidences.length
      ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length
      : 0,
    lines: ocrLines,
  };
}

function ocrScore(result: { text: string; confidence: number }): number {
  const dates = (result.text.match(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g) || []).length;
  const amounts = (result.text.match(/\b\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\b\d+\.\d{1,2}\b/g) || []).length;
  const transactionWords = (result.text.match(/\b(?:debit|credit|withdrawal|deposit|neft|imps|upi|charges?|balance)\b/gi) || []).length;
  return result.confidence + Math.min(result.text.length / 100, 50) + dates * 8 + amounts * 2 + transactionWords * 3;
}

function needsOcrRetry(result: { text: string; confidence: number }): boolean {
  const dates = (result.text.match(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g) || []).length;
  const amounts = (result.text.match(/\b\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\b\d+\.\d{1,2}\b/g) || []).length;
  const statementWords = (result.text.match(/\b(?:date|narration|transaction|debit|credit|balance|statement)\b/gi) || []).length;
  return result.text.length < 500 || dates < 2 || amounts < 4 || statementWords < 1 || result.confidence < 35;
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, task: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

export async function ocrPdf(
  filePath: string,
  onProgress?: (progress: OcrProgress) => void,
  language = "eng"
): Promise<OcrResult> {
  const dependencies = await getOcrDependencies();
  if (!dependencies.tesseract) throw new OcrDependencyError("tesseract");
  if (!dependencies.poppler) throw new OcrDependencyError("poppler");
  const tesseract = dependencies.tesseract;

  const workDir = join(tmpdir(), `ledgerflow-ocr-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(workDir, { recursive: true });

  try {
    onProgress?.({ stage: "preparing" });
    const prefix = join(workDir, "page");
    const dpi = Math.min(400, Math.max(150, Number(process.env.OCR_DPI || 300)));
    await execFile(dependencies.poppler, ["-png", "-gray", "-r", String(dpi), filePath, prefix], { windowsHide: true, maxBuffer: 1024 * 1024 });
    const pageFiles = (await readdir(workDir))
      .filter((file) => /^page-\d+\.png$/i.test(file))
      .sort((left, right) => Number(left.match(/\d+/)?.[0]) - Number(right.match(/\d+/)?.[0]));

    if (!pageFiles.length) throw new Error("Poppler did not render any PDF pages.");

    const concurrency = Math.max(1, Math.min(Number(process.env.OCR_CONCURRENCY || 3), 3));
    const pageResults = await mapWithConcurrency(pageFiles, concurrency, async (pageFile, index) => {
      const page = index + 1;
      onProgress?.({ stage: "reading", page, totalPages: pageFiles.length });
      const standard = await execFile(
        tesseract,
        [join(workDir, pageFile), "stdout", "--psm", "4", "-l", language, "tsv"],
        { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
      );
      const standardResult = parseTsv(standard.stdout, page);
      let selected = standardResult;
      let selectedPass: OcrResult["selectedPass"] = "fast";

      if (needsOcrRetry(standardResult)) {
        const column = await execFile(
          tesseract,
          [join(workDir, pageFile), "stdout", "--psm", "6", "-l", language, "tsv"],
          { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
        );
        const columnResult = parseTsv(column.stdout, page);
        if (ocrScore(columnResult) > ocrScore(selected)) {
          selected = columnResult;
          selectedPass = "fallback";
        }
      }

      if (dependencies.imagemagick && process.env.OCR_ENHANCED === "true" && needsOcrRetry(selected)) {
        const enhancedFile = join(workDir, `enhanced-${pageFile}`);
        await execFile(
          dependencies.imagemagick,
          [join(workDir, pageFile), "-colorspace", "Gray", "-contrast-stretch", "0x12%", "-adaptive-threshold", "31x31+10%", enhancedFile],
          { windowsHide: true, maxBuffer: 1024 * 1024 }
        );
        const enhanced = await execFile(
          tesseract,
          [enhancedFile, "stdout", "--psm", "6", "-l", language, "tsv"],
          { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
        );
        const enhancedResult = parseTsv(enhanced.stdout, page);
        if (ocrScore(enhancedResult) > ocrScore(selected)) {
          selected = enhancedResult;
          selectedPass = "enhanced";
        }
      }
      return { ...selected, selectedPass };
    });
    const enhancedPages = pageResults.filter((result) => result.selectedPass === "enhanced").length;

    onProgress?.({ stage: "combining" });
    return {
      text: pageResults.map((result) => result.text).join("\n"),
      pages: pageFiles.length,
      confidence: pageResults.reduce((sum, result) => sum + result.confidence, 0) / pageResults.length,
      method: "tesseract",
      selectedPass: enhancedPages > 0 ? "enhanced" : pageResults.some((result) => result.selectedPass === "fallback") ? "fallback" : "fast",
      lines: pageResults.flatMap((result) => result.lines),
    };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
