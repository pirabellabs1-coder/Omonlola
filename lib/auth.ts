import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { listAll, replaceAll } from "./store";

export const COOKIE_NAME = "omonlola_session";
const SESSIONS_KEY = "sessions";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_SESSIONS = 50;

export type Session = {
  id: number;
  token: string;
  user: string;
  createdAt: string;
  expiresAt: string;
};

function safeEqual(a: string, b: string): boolean {
  // Always compare on a fixed-size buffer to avoid leaking length info
  const SIZE = 128;
  const ab = Buffer.alloc(SIZE);
  const bb = Buffer.alloc(SIZE);
  ab.write(a.slice(0, SIZE), "utf8");
  bb.write(b.slice(0, SIZE), "utf8");
  return crypto.timingSafeEqual(ab, bb) && a.length === b.length;
}

/** Verifies user/password against the env vars in a timing-safe way. */
export function authenticate(user: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USER ?? "";
  const adminPwd = process.env.ADMIN_PASSWORD ?? "";
  if (!adminUser || !adminPwd) return false;
  // Run both compares unconditionally to keep timing constant
  const u = safeEqual(user, adminUser);
  const p = safeEqual(password, adminPwd);
  return u && p;
}

/** Creates a server-side session, sets HTTP-only cookie, returns the session token. */
export async function createSession(user: string): Promise<Session> {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const exp = new Date(now.getTime() + TTL_MS);
  const session: Session = {
    id: Date.now(),
    token,
    user,
    createdAt: now.toISOString(),
    expiresAt: exp.toISOString()
  };

  const all = await listAll<Session>(SESSIONS_KEY);
  const valid = all.filter((s) => new Date(s.expiresAt) > now);
  valid.unshift(session);
  await replaceAll(SESSIONS_KEY, valid.slice(0, MAX_SESSIONS));

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: exp
  });

  return session;
}

/** Returns current session if cookie is valid + non-expired. */
export async function getSession(): Promise<Session | null> {
  const c = cookies().get(COOKIE_NAME);
  if (!c?.value) return null;
  const all = await listAll<Session>(SESSIONS_KEY);
  const session = all.find((s) => s.token === c.value);
  if (!session) return null;
  if (new Date(session.expiresAt) <= new Date()) return null;
  return session;
}

/** Destroys session (server-side + cookie). */
export async function deleteSession(): Promise<void> {
  const c = cookies().get(COOKIE_NAME);
  if (c?.value) {
    const all = await listAll<Session>(SESSIONS_KEY);
    const filtered = all.filter((s) => s.token !== c.value);
    await replaceAll(SESSIONS_KEY, filtered);
  }
  cookies().delete(COOKIE_NAME);
}

/** Returns 401 NextResponse if no valid session. To be called at the top of admin route handlers. */
export async function requireAuth(): Promise<NextResponse | null> {
  const s = await getSession();
  if (!s) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}
