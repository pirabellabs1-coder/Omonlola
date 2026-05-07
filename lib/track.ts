"use client";

const SESSION_KEY = "omonlola_sid";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "anon";
  }
}

type TrackPayload = {
  kind?: "view" | "event";
  name?: string;
  path?: string;
  referrer?: string;
  sessionId?: string;
};

/** Send a tracking event — fire-and-forget, robust against page unloads. */
export function track(payload: TrackPayload): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  const body = JSON.stringify({
    ...payload,
    sessionId: payload.sessionId ?? getSessionId(),
    path: payload.path ?? window.location.pathname + window.location.search,
    referrer: payload.referrer ?? document.referrer ?? undefined
  });

  // Prefer sendBeacon for reliability (works during unload)
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/track", blob);
      if (ok) return;
    }
  } catch {
    // fall through to fetch
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

/** Convenience helper for events. */
export function trackEvent(name: string): void {
  track({ kind: "event", name });
}
