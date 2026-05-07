import { NextResponse } from "next/server";
import { appendItem, listAll, newId } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type Review } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { searchParams } = new URL(request.url);
  const onlyPublished = searchParams.get("published") === "1";
  const items = await listAll<Review>(STORE.reviews);
  return NextResponse.json(onlyPublished ? items.filter((r) => r.published) : items);
}

export async function POST(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  let body: Partial<Review>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const role = String(body.role ?? "").trim();
  const company = String(body.company ?? "").trim();
  const avatar = String(body.avatar ?? "").trim();
  const content = String(body.content ?? "").trim();
  const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating ?? 5))));

  if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  if (!content) return NextResponse.json({ error: "Témoignage requis" }, { status: 400 });

  const item: Review = {
    id: newId(),
    createdAt: new Date().toISOString(),
    name,
    role,
    company,
    avatar,
    rating,
    content,
    published: body.published ?? true
  };

  await appendItem<Review>(STORE.reviews, item);
  await logActivity("Nouveau témoignage", name, content.slice(0, 60));
  return NextResponse.json(item);
}
