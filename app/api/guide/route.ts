import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FILE = "5-erreurs-meta-ads.pdf";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "guides", FILE);
  const buf = await fs.readFile(filePath);
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${FILE}"`,
      "Content-Length": String(buf.byteLength),
      "Cache-Control": "public, max-age=3600"
    }
  });
}
