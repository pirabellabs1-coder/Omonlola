import { NextResponse } from "next/server";
import { deleteSession, getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function POST() {
  const s = await getSession();
  if (s) await logActivity("Déconnexion admin", s.user);
  await deleteSession();
  return NextResponse.json({ ok: true });
}
