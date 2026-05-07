"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  FolderKanban,
  HelpCircle,
  Inbox,
  MessageSquare,
  MousePointerClick,
  Send,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { TrafficLeadsChart } from "./Charts";
import { apiActivity, apiListLeads, apiStats, type Stats } from "./api";
import type { ActivityEntry, Lead } from "@/lib/types";

export default function OverviewPage({ onSeeLeads }: { onSeeLeads: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, l, a] = await Promise.all([apiStats(), apiListLeads(), apiActivity()]);
        setStats(s);
        setLeads(l);
        setActivity(a);
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 20_000);
    return () => clearInterval(id);
  }, []);

  const cards: { label: string; value: string | number; sub?: string; Icon: LucideIcon; color: string }[] = stats
    ? [
        {
          label: "Leads (mois)",
          value: stats.totals.leadsLastMonth,
          sub: `${stats.totals.leadsAll} au total`,
          Icon: Inbox,
          color: "text-brand"
        },
        {
          label: "Visites (mois)",
          value: stats.totals.visitsLastMonth,
          sub: `${stats.totals.visitsAll} au total`,
          Icon: Eye,
          color: "text-[#00C6FF]"
        },
        {
          label: "Conversion",
          value: `${stats.totals.conversionRate}%`,
          sub: "30 derniers jours",
          Icon: MousePointerClick,
          color: "text-[#22C55E]"
        },
        {
          label: "Réalisations",
          value: stats.totals.casesPublished,
          sub: `${stats.totals.cases} au total`,
          Icon: FolderKanban,
          color: "text-[#F59E0B]"
        },
        {
          label: "Témoignages",
          value: stats.totals.reviewsPublished,
          sub: `${stats.totals.reviews} au total`,
          Icon: MessageSquare,
          color: "text-[#FF3366]"
        },
        {
          label: "FAQ",
          value: stats.totals.faqPublished,
          sub: `${stats.totals.faq} au total`,
          Icon: HelpCircle,
          color: "text-text-muted"
        }
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-panel p-4 h-24 animate-pulse" />
            ))
          : cards.map((c) => (
              <div key={c.label} className="glass-panel p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-text-muted text-xs font-medium">{c.label}</div>
                  <c.Icon className={`w-4 h-4 ${c.color}`} />
                </div>
                <div className="text-2xl font-bold text-white">{c.value}</div>
                {c.sub && <div className="text-[10px] font-bold text-text-muted mt-1">{c.sub}</div>}
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel p-6">
          <h3 className="font-bold text-sm mb-1">Trafic & Leads (30j)</h3>
          <p className="text-text-muted text-xs mb-4">Visites et leads entrants</p>
          <div className="h-56">
            {stats ? <TrafficLeadsChart data={stats.traffic} /> : null}
          </div>
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-bold text-sm mb-1">État du système</h3>
          <p className="text-text-muted text-xs mb-4">Santé des intégrations</p>
          <ul className="space-y-3 text-sm">
            <SystemRow label="Site public" value="En ligne" ok />
            <SystemRow label="Formulaire de contact" value="Connecté" ok />
            <SystemRow label="Tracking visites" value="Actif" ok />
            <SystemRow label="Stockage" value=".data/*.json" />
          </ul>
          <Link
            href="/#contact"
            target="_blank"
            className="mt-6 inline-flex items-center gap-2 text-sm text-brand hover:underline"
          >
            <Send className="w-4 h-4" /> Tester le formulaire
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm">Derniers messages</h3>
            <button onClick={onSeeLeads} className="text-xs font-semibold text-brand hover:underline">
              Voir tout
            </button>
          </div>
          {leads.length === 0 ? (
            <div className="empty-state">
              <Inbox className="w-10 h-10 text-text-muted mx-auto" />
              <p className="text-text-muted text-sm mt-2">Aucun lead pour le moment</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leads.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.03]">
                  <div className="w-9 h-9 rounded-full bg-brand/15 text-brand flex items-center justify-center font-bold text-xs shrink-0">
                    {l.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <div className="text-sm font-bold text-white truncate">{l.name}</div>
                      <div className="text-[10px] text-text-muted whitespace-nowrap">
                        {new Date(l.receivedAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2">{l.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-sm mb-6">Activité récente</h3>
          {activity.length === 0 ? (
            <div className="empty-state">
              <p className="text-text-muted text-sm">Aucune activité enregistrée</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-brand mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {a.action} <span className="text-text-muted font-normal">— {a.target}</span>
                    </div>
                    <div className="text-[10px] text-text-muted">{new Date(a.at).toLocaleString("fr-FR")}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SystemRow({ label, value, ok = false }: { label: string; value: string; ok?: boolean }) {
  return (
    <li className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={`font-semibold ${ok ? "text-green-400" : "text-white"}`}>{value}</span>
    </li>
  );
}
