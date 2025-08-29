import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "app", "resume", "resources", "resume.cls");
    const content = fs.readFileSync(filePath, "utf8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load resume.cls" }, { status: 500 });
  }
}


