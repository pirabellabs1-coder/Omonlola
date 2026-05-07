import { NextResponse } from "next/server";
import { appendItem, listAll, newId, replaceAll } from "@/lib/store";
import { STORE, type TrackEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_EVENTS = 5000;

export async function POST(request: Request) {
  let body: Partial<TrackEvent>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const ua = request.headers.get("user-agent") ?? undefined;

  const ev: TrackEvent = {
    id: newId(),
    at: new Date().toISOString(),
    path: String(body.path ?? "/").slice(0, 200),
    referrer: body.referrer ? String(body.referrer).slice(0, 200) : undefined,
    sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
    ua,
    kind: body.kind === "event" ? "event" : "view",
    name: body.name ? String(body.name).slice(0, 80) : undefined
  };

  await appendItem<TrackEvent>(STORE.track, ev);
  const all = await listAll<TrackEvent>(STORE.track);
  if (all.length > MAX_EVENTS) {
    await replaceAll<TrackEvent>(STORE.track, all.slice(0, MAX_EVENTS));
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const all = await listAll<TrackEvent>(STORE.track);
  return NextResponse.json(all);
}
