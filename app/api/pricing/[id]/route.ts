import { NextResponse } from "next/server";
import { deleteItem, updateItem } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type PricingPlan } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

function sanitizeFeatures(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, 12)
    .map((f) => String(f ?? "").trim())
    .filter(Boolean);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  let body: Partial<PricingPlan>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: Partial<PricingPlan> = { updatedAt: new Date().toISOString() };
  if (body.name !== undefined) patch.name = String(body.name).trim();
  if (body.description !== undefined) patch.description = String(body.description).trim();
  if (body.price !== undefined) patch.price = String(body.price).trim();
  if (body.unit !== undefined) patch.unit = String(body.unit).trim();
  if (body.features !== undefined) patch.features = sanitizeFeatures(body.features);
  if (body.cta !== undefined) patch.cta = String(body.cta).trim();
  if (body.ctaLink !== undefined) patch.ctaLink = String(body.ctaLink).trim() || "#contact";
  if (body.popular !== undefined) patch.popular = Boolean(body.popular);
  if (body.order !== undefined) patch.order = Number(body.order);
  if (body.published !== undefined) patch.published = Boolean(body.published);

  const updated = await updateItem<PricingPlan>(STORE.pricing, id, patch);
  if (!updated) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Offre modifiée", updated.name);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  const removed = await deleteItem<PricingPlan>(STORE.pricing, id);
  if (!removed) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Offre supprimée", removed.name);
  return NextResponse.json({ ok: true });
}
