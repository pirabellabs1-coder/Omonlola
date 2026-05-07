import { NextResponse } from "next/server";
import { appendItem, listAll, newId } from "@/lib/store";
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

export async function GET(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { searchParams } = new URL(request.url);
  const onlyPublished = searchParams.get("published") === "1";
  const items = await listAll<CaseItem>(STORE.cases);
  const filtered = onlyPublished ? items.filter((c) => c.published) : items;
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  let body: Partial<CaseItem>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const client = String(body.client ?? "").trim();
  const description = String(body.description ?? "").trim();
  const longBody = String(body.body ?? "").trim();
  const image = String(body.image ?? "").trim();
  const icon = String(body.icon ?? "shopping-bag").trim();
  const sector = body.sector;

  if (!title) return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  if (!sector || !SECTORS.includes(sector))
    return NextResponse.json({ error: "Secteur invalide" }, { status: 400 });

  const now = new Date().toISOString();
  const item: CaseItem = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    title,
    client,
    sector,
    description,
    body: longBody,
    image,
    icon,
    kpis: sanitizeKpis(body.kpis),
    published: body.published ?? true
  };

  await appendItem<CaseItem>(STORE.cases, item);
  await logActivity("Nouvelle réalisation", title, sector);
  return NextResponse.json(item);
}
