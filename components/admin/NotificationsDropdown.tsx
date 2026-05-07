"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  FolderKanban,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  MessageSquare,
  Settings as SettingsIcon,
  type LucideIcon
} from "lucide-react";
import { apiActivity } from "./api";
import type { ActivityEntry } from "@/lib/types";
import type { AdminPage } from "./Sidebar";

const READ_KEY = "omonlola_notifs_read_at";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}

function classify(action: string): { page: AdminPage; Icon: LucideIcon; color: string } {
  const a = action.toLowerCase();
  if (a.includes("lead")) return { page: "leads", Icon: Inbox, color: "text-brand" };
  if (a.includes("réalisation") || a.includes("realisation"))
    return { page: "cases", Icon: FolderKanban, color: "text-[#F59E0B]" };
  if (a.includes("témoignage") || a.includes("temoignage"))
    return { page: "reviews", Icon: MessageSquare, color: "text-[#FF3366]" };
  if (a.includes("faq")) return { page: "faq", Icon: HelpCircle, color: "text-text-muted" };
  if (a.includes("image") || a.includes("upload"))
    return { page: "cases", Icon: ImageIcon, color: "text-[#00C6FF]" };
  if (a.includes("paramètre") || a.includes("parametre"))
    return { page: "settings", Icon: SettingsIcon, color: "text-white" };
  return { page: "activity", Icon: Bell, color: "text-text-muted" };
}

export default function NotificationsDropdown({ onJump }: { onJump: (page: AdminPage) => void }) {
  const [items, setItems] = useState<ActivityEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [readAt, setReadAt] = useState<number>(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(READ_KEY) ?? "0");
    setReadAt(stored);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await apiActivity();
        if (!cancelled) setItems(data);
      } catch {
        // silent
      }
    };
    load();
    const id = setInterval(load, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = items.filter((i) => new Date(i.at).getTime() > readAt).length;

  function markAllRead() {
    const now = Date.now();
    localStorage.setItem(READ_KEY, String(now));
    setReadAt(now);
  }

  function jumpTo(page: AdminPage) {
    onJump(page);
    setOpen(false);
    markAllRead();
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-all relative"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-80 glass-panel rounded-xl overflow-hidden z-50 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-bold text-sm">Notifications</h4>
            {items.length > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand hover:underline">
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 text-text-muted mx-auto opacity-30 mb-2" />
                <p className="text-text-muted text-sm">Aucune notification pour le moment</p>
              </div>
            ) : (
              items.slice(0, 20).map((it) => {
                const isUnread = new Date(it.at).getTime() > readAt;
                const { page, Icon, color } = classify(it.action);
                return (
                  <button
                    key={it.id}
                    onClick={() => jumpTo(page)}
                    className={`w-full px-4 py-3 flex gap-3 text-left hover:bg-white/[0.04] transition-colors ${
                      isUnread ? "" : "opacity-60"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center ${color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">
                        <span className="font-bold">{it.action}</span>
                        <span className="text-text-muted"> — {it.target}</span>
                      </p>
                      <p className="text-[10px] text-text-muted mt-1">{timeAgo(it.at)}</p>
                    </div>
                    {isUnread && (
                      <span className="w-2 h-2 mt-2 rounded-full bg-brand shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
