import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { processPDF } from "@/lib/pdfProcessor";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "uploads");
    try {
      await writeFile(
        join(uploadDir, file.name),
        Buffer.from(await file.arrayBuffer())
      );
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json({ error: "Error saving file" }, { status: 500 });
    }

    // Process the PDF
    await processPDF(join(uploadDir, file.name));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
