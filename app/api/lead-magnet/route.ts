import { NextResponse } from "next/server";
import { appendItem, listAll, newId } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type LeadMagnetEntry } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const entry: LeadMagnetEntry = {
    id: newId(),
    receivedAt: new Date().toISOString(),
    email
  };

  await appendItem<LeadMagnetEntry>(STORE.leadMagnet, entry);
  await logActivity("Téléchargement guide", email);
  return NextResponse.json({ ok: true, fileUrl: "/guides/5-erreurs-meta-ads.pdf" });
}

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const all = await listAll<LeadMagnetEntry>(STORE.leadMagnet);
  return NextResponse.json(all);
}
