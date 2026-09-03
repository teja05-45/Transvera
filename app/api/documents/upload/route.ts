import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { storeUploadedFile } from "@/lib/services/file-store";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 20MB limit" },
        { status: 413 }
      );
    }

    // Generate unique document ID
    const documentId = uuid();

    // Store the file
    const buffer = await file.arrayBuffer();
    await storeUploadedFile(documentId, Buffer.from(buffer), file.name, file.size);

    return NextResponse.json({
      documentId,
      status: "uploaded",
      fileName: file.name,
      sizeBytes: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
