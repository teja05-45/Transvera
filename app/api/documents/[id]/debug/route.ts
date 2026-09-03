import { NextResponse } from "next/server";
import { getDocumentDebug } from "@/lib/services/debug-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { id } = await params;
  const snapshot = getDocumentDebug(id);
  if (!snapshot) return NextResponse.json({ error: "Debug snapshot not found" }, { status: 404 });
  return NextResponse.json(snapshot);
}
