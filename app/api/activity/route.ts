import { NextResponse } from "next/server";
import { listAll } from "@/lib/store";
import { STORE, type ActivityEntry } from "@/lib/types";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const all = await listAll<ActivityEntry>(STORE.activity);
  return NextResponse.json(all);
}
