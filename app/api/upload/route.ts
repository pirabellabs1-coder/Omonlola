import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { logActivity } from "@/lib/activity";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif"
]);

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif"
};

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté (JPG, PNG, WEBP, GIF, AVIF)" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 8 Mo)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXT_BY_MIME[file.type] ?? path.extname(file.name) ?? ".bin";
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  let url: string;

  if (USE_BLOB) {
    // Production: store on Vercel Blob (publicly readable URL)
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: file.type
    });
    url = blob.url;
  } else {
    // Local dev (or fallback): write to public/uploads
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buffer);
    url = `/uploads/${filename}`;
  }

  await logActivity("Image uploadée", file.name || filename, url);
  return NextResponse.json({ ok: true, url, size: file.size, type: file.type });
}
