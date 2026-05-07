"use client";

import {
  BarChart3,
  Clock,
  FolderKanban,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Tag,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminPage =
  | "overview"
  | "analytics"
  | "leads"
  | "cases"
  | "reviews"
  | "faq"
  | "pricing"
  | "activity"
  | "settings";

const groups: { title: string; items: { id: AdminPage; label: string; Icon: LucideIcon }[] }[] = [
  {
    title: "Tableau de bord",
    items: [
      { id: "overview", label: "Vue d'ensemble", Icon: LayoutDashboard },
      { id: "analytics", label: "Analytics", Icon: BarChart3 },
      { id: "leads", label: "Leads Entrants", Icon: Inbox }
    ]
  },
  {
    title: "Contenu du Site",
    items: [
      { id: "cases", label: "Réalisations", Icon: FolderKanban },
      { id: "reviews", label: "Témoignages", Icon: MessageSquare },
      { id: "faq", label: "FAQ", Icon: HelpCircle },
      { id: "pricing", label: "Tarifs / Offres", Icon: Tag }
    ]
  },
  {
    title: "Système",
    items: [
      { id: "activity", label: "Journal d'activité", Icon: Clock },
      { id: "settings", label: "Paramètres", Icon: Settings }
    ]
  }
];

export default function Sidebar({
  current,
  onSelect,
  badges,
  onLogout,
  open,
  onClose
}: {
  current: AdminPage;
  onSelect: (p: AdminPage) => void;
  badges: Partial<Record<AdminPage, number>>;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-30 md:hidden ${open ? "block" : "hidden"}`}
        aria-hidden="true"
      />
      {/* Fixed sidebar (desktop) — slide-in (mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-sidebar border-r border-white/5 flex flex-col z-40 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="font-bold text-xl flex items-center gap-2">
            <Zap className="text-brand w-5 h-5" />
            <span className="text-white tracking-tight">Omonlola</span>
            <span className="text-brand">AI</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 sidebar-scroll">
          {groups.map((g) => (
            <div key={g.title} className="mb-8">
              <div className="px-6 text-[10px] font-bold tracking-widest text-text-muted mb-3 uppercase">
                {g.title}
              </div>
              <nav className="space-y-1">
                {g.items.map(({ id, label, Icon }) => {
                  const badge = badges[id];
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        onSelect(id);
                        onClose();
                      }}
                      className={`w-full nav-item flex items-center justify-between px-6 py-3 text-left ${
                        current === id ? "active" : ""
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                      </span>
                      {badge !== undefined && (
                        <span
                          className={`min-w-[20px] text-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            id === "leads" && badge > 0
                              ? "bg-brand/20 text-brand border border-brand/30"
                              : "bg-white/10 text-text-muted"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center font-bold text-white text-xs">
              O
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white leading-tight">Omonlola</div>
              <div className="text-xs text-text-muted">Admin</div>
            </div>
            <button
              onClick={onLogout}
              className="text-text-muted hover:text-red-400 transition-colors"
              aria-label="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
