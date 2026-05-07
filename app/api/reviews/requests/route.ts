import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { appendItem, listAll, newId } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type ReviewRequest } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const all = await listAll<ReviewRequest>(STORE.reviewRequests);
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  let body: Partial<ReviewRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const clientName = String(body.clientName ?? "").trim();
  const clientEmail = String(body.clientEmail ?? "").trim();
  const note = String(body.note ?? "").trim();

  if (!clientName) {
    return NextResponse.json({ error: "Nom du client requis" }, { status: 400 });
  }

  const token = crypto.randomBytes(16).toString("hex");

  const item: ReviewRequest = {
    id: newId(),
    token,
    clientName,
    clientEmail,
    note,
    createdAt: new Date().toISOString()
  };

  await appendItem<ReviewRequest>(STORE.reviewRequests, item);
  await logActivity("Invitation témoignage", clientName, clientEmail || undefined);

  // Build absolute URL using the request's origin (works on any host)
  const origin = new URL(request.url).origin;
  const url = `${origin}/review/${token}`;

  return NextResponse.json({ ...item, url });
}
