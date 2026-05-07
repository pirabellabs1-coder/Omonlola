"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

const SCROLL_MILESTONES = [25, 50, 75, 100];

export default function Tracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;

    // 1. Page view
    track({ kind: "view" });

    // 2. Scroll depth milestones
    const reached = new Set<number>();
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      if (docHeight <= window.innerHeight) return;
      const pct = Math.min(100, Math.round((scrolled / docHeight) * 100));
      for (const m of SCROLL_MILESTONES) {
        if (pct >= m && !reached.has(m)) {
          reached.add(m);
          track({ kind: "event", name: `scroll_${m}` });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 3. Session duration on unload
    const startedAt = Date.now();
    const onLeave = () => {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      track({ kind: "event", name: `session_end_${bucket(seconds)}` });
    };
    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onLeave();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  return null;
}

/** Group session length into useful buckets to avoid event explosion. */
function bucket(s: number): string {
  if (s < 10) return "0_10s";
  if (s < 30) return "10_30s";
  if (s < 60) return "30_60s";
  if (s < 180) return "1_3m";
  if (s < 600) return "3_10m";
  return "10m_plus";
}
