import { NextResponse } from "next/server";
import { deleteItem, updateItem } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type FaqItem } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  let body: Partial<FaqItem>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: Partial<FaqItem> = { updatedAt: new Date().toISOString() };
  if (body.question !== undefined) patch.question = String(body.question).trim();
  if (body.answer !== undefined) patch.answer = String(body.answer).trim();
  if (body.order !== undefined) patch.order = Number(body.order);
  if (body.published !== undefined) patch.published = Boolean(body.published);

  const updated = await updateItem<FaqItem>(STORE.faq, id, patch);
  if (!updated) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("FAQ modifiée", updated.question);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  const removed = await deleteItem<FaqItem>(STORE.faq, id);
  if (!removed) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("FAQ supprimée", removed.question);
  return NextResponse.json({ ok: true });
}
