import { NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiting per process. Resets on restart.
type Bucket = { count: number; until: number };
const buckets = new Map<string, Bucket>();
const MAX_FAILS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 min

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "anon"
  );
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const b = buckets.get(key);
  if (b && b.until > now && b.count >= MAX_FAILS) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429 }
    );
  }

  let body: { user?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const user = String(body.user ?? "").trim();
  const password = String(body.password ?? "");

  if (!user || !password) {
    return NextResponse.json({ error: "Identifiants requis" }, { status: 400 });
  }

  if (!authenticate(user, password)) {
    const cur = buckets.get(key) ?? { count: 0, until: now + WINDOW_MS };
    cur.count += 1;
    cur.until = now + WINDOW_MS;
    buckets.set(key, cur);
    // Avoid revealing which field is wrong
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  // Reset bucket on success
  buckets.delete(key);

  await createSession(user);
  await logActivity("Connexion admin", user);

  return NextResponse.json({ ok: true });
}
