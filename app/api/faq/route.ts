import { NextResponse } from "next/server";
import { appendItem, listAll, newId } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type FaqItem } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { searchParams } = new URL(request.url);
  const onlyPublished = searchParams.get("published") === "1";
  const items = await listAll<FaqItem>(STORE.faq);
  const filtered = onlyPublished ? items.filter((f) => f.published) : items;
  filtered.sort((a, b) => a.order - b.order);
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  let body: Partial<FaqItem>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const question = String(body.question ?? "").trim();
  const answer = String(body.answer ?? "").trim();

  if (!question) return NextResponse.json({ error: "Question requise" }, { status: 400 });
  if (!answer) return NextResponse.json({ error: "Réponse requise" }, { status: 400 });

  const existing = await listAll<FaqItem>(STORE.faq);
  const order = body.order ?? existing.length;

  const now = new Date().toISOString();
  const item: FaqItem = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    question,
    answer,
    order,
    published: body.published ?? true
  };

  await appendItem<FaqItem>(STORE.faq, item);
  await logActivity("Nouvelle FAQ", question);
  return NextResponse.json(item);
}
