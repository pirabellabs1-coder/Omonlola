import { NextResponse } from "next/server";
import { appendItem, listAll, newId } from "@/lib/store";
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

export async function GET(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { searchParams } = new URL(request.url);
  const onlyPublished = searchParams.get("published") === "1";
  const items = await listAll<PricingPlan>(STORE.pricing);
  const filtered = onlyPublished ? items.filter((p) => p.published) : items;
  filtered.sort((a, b) => a.order - b.order);
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  let body: Partial<PricingPlan>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Nom de l'offre requis" }, { status: 400 });

  const description = String(body.description ?? "").trim();
  const price = String(body.price ?? "").trim();
  const unit = String(body.unit ?? "").trim();
  const cta = String(body.cta ?? "Demander un devis").trim();
  const ctaLink = String(body.ctaLink ?? "#contact").trim() || "#contact";

  const existing = await listAll<PricingPlan>(STORE.pricing);
  const order = typeof body.order === "number" ? body.order : existing.length;

  const now = new Date().toISOString();
  const item: PricingPlan = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name,
    description,
    price,
    unit,
    features: sanitizeFeatures(body.features),
    cta,
    ctaLink,
    popular: Boolean(body.popular),
    order,
    published: body.published ?? true
  };

  await appendItem<PricingPlan>(STORE.pricing, item);
  await logActivity("Nouvelle offre", name, price);
  return NextResponse.json(item);
}
