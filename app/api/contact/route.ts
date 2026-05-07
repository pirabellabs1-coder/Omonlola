import { NextResponse } from "next/server";
import { appendItem, listAll, newId } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type Lead } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Partial<Lead>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim();
  const email = (body.email ?? "").toString().trim();
  const budget = (body.budget ?? "").toString().trim();
  const message = (body.message ?? "").toString().trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const lead: Lead = {
    id: newId(),
    receivedAt: new Date().toISOString(),
    type: "contact",
    name,
    email,
    budget,
    message,
    status: "new"
  };

  await appendItem<Lead>(STORE.leads, lead);
  await logActivity("Nouveau lead", `${name} <${email}>`, message.slice(0, 80));

  return NextResponse.json({ ok: true, id: lead.id });
}

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const all = await listAll<Lead>(STORE.leads);
  return NextResponse.json(all);
}
