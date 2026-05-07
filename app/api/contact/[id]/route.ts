import { NextResponse } from "next/server";
import { deleteItem, updateItem } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type Lead, type LeadStatus } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID: LeadStatus[] = ["new", "in-progress", "won", "archived"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  let body: { status?: LeadStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.status || !VALID.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const updated = await updateItem<Lead>(STORE.leads, id, { status: body.status });
  if (!updated) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await logActivity("Statut lead modifié", updated.name, `→ ${body.status}`);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  const removed = await deleteItem<Lead>(STORE.leads, id);
  if (!removed) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Lead supprimé", removed.name);
  return NextResponse.json({ ok: true });
}
