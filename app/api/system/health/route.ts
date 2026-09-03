import { NextResponse } from "next/server";
import { getOcrDependencies } from "@/lib/services/ocr";

export async function GET() {
  const dependencies = await getOcrDependencies();
  return NextResponse.json({
    pdfExtraction: "ok",
    ocr: dependencies.tesseract ? "ok" : "unavailable",
    poppler: dependencies.poppler ? "ok" : "unavailable",
  });
}
