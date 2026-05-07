import { NextResponse } from "next/server";
import { deleteItem } from "@/lib/store";
import { logActivity } from "@/lib/activity";
import { STORE, type ReviewRequest } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const id = Number(params.id);
  const removed = await deleteItem<ReviewRequest>(STORE.reviewRequests, id);
  if (!removed) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await logActivity("Invitation témoignage supprimée", removed.clientName);
  return NextResponse.json({ ok: true });
}
