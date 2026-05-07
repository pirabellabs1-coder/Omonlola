import { NextResponse } from "next/server";
import { deleteItem, updateItem } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type CaseItem, type CaseSector, type Kpi } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SECTORS: CaseSector[] = ["E-commerce", "SaaS & B2B", "Info-produit", "Coaching"];

function sanitizeKpis(input: unknown): Kpi[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, 4)
    .map((k) => ({
      name: String((k as Kpi)?.name ?? "").trim(),
      value: String((k as Kpi)?.value ?? "").trim()
    }))
    .filter((k) => k.name && k.value);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  let body: Partial<CaseItem>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: Partial<CaseItem> = { updatedAt: new Date().toISOString() };
  if (body.title !== undefined) patch.title = String(body.title).trim();
  if (body.client !== undefined) patch.client = String(body.client).trim();
  if (body.description !== undefined) patch.description = String(body.description).trim();
  if (body.body !== undefined) patch.body = String(body.body).trim();
  if (body.image !== undefined) patch.image = String(body.image).trim();
  if (body.icon !== undefined) patch.icon = String(body.icon).trim();
  if (body.sector !== undefined) {
    if (!SECTORS.includes(body.sector)) return NextResponse.json({ error: "Secteur invalide" }, { status: 400 });
    patch.sector = body.sector;
  }
  if (body.kpis !== undefined) patch.kpis = sanitizeKpis(body.kpis);
  if (body.published !== undefined) patch.published = Boolean(body.published);

  const updated = await updateItem<CaseItem>(STORE.cases, id, patch);
  if (!updated) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Réalisation modifiée", updated.title);
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  const removed = await deleteItem<CaseItem>(STORE.cases, id);
  if (!removed) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Réalisation supprimée", removed.title);
  return NextResponse.json({ ok: true });
}
