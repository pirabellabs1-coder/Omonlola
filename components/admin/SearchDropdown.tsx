"use client";

import { useEffect, useRef, useState } from "react";
import {
  FolderKanban,
  HelpCircle,
  Inbox,
  MessageSquare,
  Search,
  type LucideIcon
} from "lucide-react";
import {
  apiListCases,
  apiListFaq,
  apiListLeads,
  apiListReviews
} from "./api";
import type { AdminPage } from "./Sidebar";

type Result = {
  type: "lead" | "case" | "review" | "faq";
  page: AdminPage;
  label: string;
  sub: string;
  Icon: LucideIcon;
};

export default function SearchDropdown({ onJump }: { onJump: (page: AdminPage) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const [leads, cases, reviews, faq] = await Promise.all([
          apiListLeads(),
          apiListCases(),
          apiListReviews(),
          apiListFaq()
        ]);
        const out: Result[] = [];
        for (const l of leads) {
          if (
            l.name.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q) ||
            l.message.toLowerCase().includes(q)
          ) {
            out.push({ type: "lead", page: "leads", label: l.name, sub: l.email, Icon: Inbox });
          }
        }
        for (const c of cases) {
          if (
            c.title.toLowerCase().includes(q) ||
            c.sector.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
          ) {
            out.push({ type: "case", page: "cases", label: c.title, sub: c.sector, Icon: FolderKanban });
          }
        }
        for (const r of reviews) {
          if (
            r.name.toLowerCase().includes(q) ||
            r.content.toLowerCase().includes(q) ||
            (r.company ?? "").toLowerCase().includes(q)
          ) {
            out.push({ type: "review", page: "reviews", label: r.name, sub: r.content.slice(0, 60), Icon: MessageSquare });
          }
        }
        for (const f of faq) {
          if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
            out.push({ type: "faq", page: "faq", label: f.question, sub: f.answer.slice(0, 60), Icon: HelpCircle });
          }
        }
        setResults(out.slice(0, 12));
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted pointer-events-none" />
      <input
        type="text"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        placeholder="Rechercher partout…"
        className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-brand transition-all w-64"
      />
      {open && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 glass-panel rounded-xl overflow-hidden z-50 max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-text-muted text-sm">Recherche…</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-text-muted text-sm">Aucun résultat</div>
          ) : (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  onJump(r.page);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors text-left"
              >
                <r.Icon className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{r.label}</div>
                  <div className="text-[10px] text-text-muted truncate">{r.sub}</div>
                </div>
                <span className="text-[10px] uppercase text-text-muted bg-white/5 px-2 py-0.5 rounded shrink-0">
                  {r.type}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
