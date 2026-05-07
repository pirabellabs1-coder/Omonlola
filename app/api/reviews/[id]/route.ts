import { NextResponse } from "next/server";
import { deleteItem, updateItem } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type Review } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  let body: Partial<Review>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: Partial<Review> = {};
  if (body.name !== undefined) patch.name = String(body.name).trim();
  if (body.role !== undefined) patch.role = String(body.role).trim();
  if (body.company !== undefined) patch.company = String(body.company).trim();
  if (body.avatar !== undefined) patch.avatar = String(body.avatar).trim();
  if (body.content !== undefined) patch.content = String(body.content).trim();
  if (body.rating !== undefined) {
    patch.rating = Math.max(1, Math.min(5, Math.round(Number(body.rating))));
  }
  if (body.published !== undefined) patch.published = Boolean(body.published);

  const updated = await updateItem<Review>(STORE.reviews, id, patch);
  if (!updated) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Témoignage modifié", updated.name);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  const removed = await deleteItem<Review>(STORE.reviews, id);
  if (!removed) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Témoignage supprimé", removed.name);
  return NextResponse.json({ ok: true });
}
