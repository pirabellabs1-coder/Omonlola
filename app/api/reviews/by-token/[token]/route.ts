import { NextResponse } from "next/server";
import { appendItem, listAll, newId, updateItem } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type Review, type ReviewRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const token = String(params.token ?? "");
  if (!token) return NextResponse.json({ error: "Token manquant" }, { status: 400 });

  const all = await listAll<ReviewRequest>(STORE.reviewRequests);
  const req = all.find((r) => r.token === token);
  if (!req) return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 404 });

  return NextResponse.json({
    clientName: req.clientName,
    note: req.note,
    submitted: Boolean(req.submittedAt)
  });
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  const token = String(params.token ?? "");
  if (!token) return NextResponse.json({ error: "Token manquant" }, { status: 400 });

  const all = await listAll<ReviewRequest>(STORE.reviewRequests);
  const req = all.find((r) => r.token === token);
  if (!req) return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 404 });

  if (req.submittedAt) {
    return NextResponse.json({ error: "Témoignage déjà soumis" }, { status: 410 });
  }

  let body: Partial<Review>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const content = String(body.content ?? "").trim();
  const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating ?? 5))));
  if (!content) return NextResponse.json({ error: "Le témoignage est requis" }, { status: 400 });

  const review: Review = {
    id: newId(),
    createdAt: new Date().toISOString(),
    name: req.clientName, // identity locked to the invitation
    role: String(body.role ?? "").trim(),
    company: String(body.company ?? "").trim(),
    avatar: String(body.avatar ?? "").trim(),
    rating,
    content,
    published: false, // moderated by default — admin must publish
    source: "invited",
    requestId: req.id
  };

  await appendItem<Review>(STORE.reviews, review);
  await updateItem<ReviewRequest>(STORE.reviewRequests, req.id, {
    submittedAt: new Date().toISOString(),
    reviewId: review.id
  });
  await logActivity("Témoignage reçu", req.clientName, content.slice(0, 60));

  return NextResponse.json({ ok: true });
}
