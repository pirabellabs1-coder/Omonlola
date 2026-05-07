"use client";

import { useEffect, useState } from "react";
import { Activity, Globe, Monitor, Smartphone, Tablet, type LucideIcon } from "lucide-react";
import {
  ConversionLine,
  FunnelBar,
  SourcesDoughnut,
  SourcesPerfBar,
  Traffic12mChart
} from "./Charts";
import { apiStats, type Stats } from "./api";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const s = await apiStats();
        if (!cancelled) setStats(s);
      } catch {
        // silent
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Analytics</h2>
        <p className="text-text-muted text-sm">
          Données de performance issues du tracking et des conversions réelles.
        </p>
      </div>

      {/* ===== Performance commerciale ===== */}
      <h3 className="text-xs uppercase font-bold tracking-widest text-text-muted mb-3">Performance commerciale</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="glass-panel p-6 lg:col-span-2">
          <h4 className="font-bold text-sm mb-1">Vue d&apos;ensemble du trafic</h4>
          <p className="text-text-muted text-xs mb-4">12 derniers mois — Visites, Leads, Conversions</p>
          <div className="h-64">{stats ? <Traffic12mChart data={stats.traffic12m} /> : null}</div>
        </div>

        <div className="glass-panel p-6">
          <h4 className="font-bold text-sm mb-1">Performance par source</h4>
          <p className="text-text-muted text-xs mb-4">Visites · Leads · Taux de conversion</p>
          <div className="h-56">{stats ? <SourcesPerfBar data={stats.sourcesPerf} /> : null}</div>
        </div>

        <div className="glass-panel p-6">
          <h4 className="font-bold text-sm mb-1">Entonnoir de conversion</h4>
          <p className="text-text-muted text-xs mb-4">Parcours visiteur → lead qualifié</p>
          <div className="h-56">{stats ? <FunnelBar data={stats.funnel} /> : null}</div>
        </div>

        <div className="glass-panel p-6 lg:col-span-2">
          <h4 className="font-bold text-sm mb-1">Taux de conversion mensuel</h4>
          <p className="text-text-muted text-xs mb-4">Leads / Visites — 6 derniers mois</p>
          <div className="h-56">{stats ? <ConversionLine data={stats.conversion} /> : null}</div>
        </div>
      </div>

      {/* ===== SEO Insights ===== */}
      <h3 className="text-xs uppercase font-bold tracking-widest text-text-muted mb-3">
        SEO &amp; Audience — page d&apos;accueil
      </h3>

      {/* SEO summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SeoCard
          label="Sessions"
          value={stats?.seo.sessions ?? 0}
          hint="utilisateurs uniques (par session)"
        />
        <SeoCard
          label="Pages vues"
          value={stats?.totals.visitsAll ?? 0}
          hint="total des pages vues"
        />
        <SeoCard
          label="Taux de rebond"
          value={`${stats?.seo.bounceRate ?? 0}%`}
          hint="sessions à 1 page"
        />
        <SeoCard
          label="Conversion globale"
          value={`${stats?.totals.conversionRate ?? 0}%`}
          hint="leads / visites (30j)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h4 className="font-bold text-sm mb-1">Pages les plus vues</h4>
          <p className="text-text-muted text-xs mb-4">Top URLs sur la période</p>
          <RankList items={stats?.seo.topPages ?? []} mono empty="Aucune visite encore." />
        </div>

        <div className="glass-panel p-6">
          <h4 className="font-bold text-sm mb-1">Top referrers</h4>
          <p className="text-text-muted text-xs mb-4">Domaines qui envoient du trafic</p>
          <RankList
            items={stats?.seo.topReferrers ?? []}
            empty="Pas de referrer détecté."
          />
        </div>

        <div className="glass-panel p-6">
          <h4 className="font-bold text-sm mb-1">Sources d&apos;acquisition</h4>
          <p className="text-text-muted text-xs mb-4">Origine du trafic (depuis les referrers)</p>
          <div className="h-56">{stats ? <SourcesDoughnut data={stats.sources} /> : null}</div>
        </div>

        <div className="glass-panel p-6">
          <h4 className="font-bold text-sm mb-1">Devices</h4>
          <p className="text-text-muted text-xs mb-4">Répartition mobile / tablet / desktop</p>
          <DevicesList items={stats?.seo.devices ?? []} />
        </div>
      </div>

      {/* ===== Events tracking ===== */}
      <h3 className="text-xs uppercase font-bold tracking-widest text-text-muted mt-10 mb-3">
        Événements — comportement utilisateur
      </h3>
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-brand" />
          <h4 className="font-bold text-sm">Tous les événements suivis</h4>
        </div>
        <p className="text-text-muted text-xs mb-4">
          Scroll depth, clics CTA, soumissions de formulaire, durée de session
        </p>
        <EventsList items={stats?.seo.events ?? []} />
      </div>
    </div>
  );
}

function EventsList({ items }: { items: { label: string; value: number }[] }) {
  if (items.length === 0) {
    return (
      <div className="text-text-muted text-sm text-center py-10 border border-dashed border-white/10 rounded-lg">
        Aucun événement enregistré pour le moment.
      </div>
    );
  }
  const max = Math.max(...items.map((i) => i.value), 1);

  // Group events by category for readability
  const groups: Record<string, { label: string; value: number }[]> = {
    "Engagement (scroll)": [],
    "Sessions": [],
    "Conversions": [],
    Autres: []
  };
  for (const it of items) {
    if (it.label.startsWith("scroll_")) groups["Engagement (scroll)"].push(it);
    else if (it.label.startsWith("session_")) groups["Sessions"].push(it);
    else if (
      it.label.startsWith("contact_") ||
      it.label.startsWith("lead_magnet_") ||
      it.label === "whatsapp_click"
    )
      groups["Conversions"].push(it);
    else groups["Autres"].push(it);
  }

  const ordered: [string, { label: string; value: number }[]][] = Object.entries(groups).filter(
    ([, arr]) => arr.length > 0
  );

  return (
    <div className="space-y-6">
      {ordered.map(([groupLabel, arr]) => (
        <div key={groupLabel}>
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-2">{groupLabel}</div>
          <ul className="space-y-2">
            {arr
              .sort((a, b) => b.value - a.value)
              .map((it) => (
                <li key={it.label} className="flex items-center gap-3 text-sm">
                  <code className="flex-1 text-xs font-mono truncate text-white/85">{it.label}</code>
                  <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-full bg-brand"
                      style={{ width: `${Math.round((it.value / max) * 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-text-muted shrink-0">{it.value}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SeoCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="glass-panel p-4">
      <div className="text-text-muted text-xs font-medium mb-2">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {hint && <div className="text-[10px] text-text-muted mt-1">{hint}</div>}
    </div>
  );
}

function RankList({
  items,
  mono = false,
  empty
}: {
  items: { label: string; value: number }[];
  mono?: boolean;
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <div className="text-text-muted text-sm text-center py-10 border border-dashed border-white/10 rounded-lg">
        {empty}
      </div>
    );
  }
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-3 text-sm">
          <span className={`flex-1 truncate ${mono ? "font-mono text-xs" : ""}`}>{it.label}</span>
          <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-brand"
              style={{ width: `${Math.round((it.value / max) * 100)}%` }}
            />
          </div>
          <span className="w-10 text-right text-xs text-text-muted shrink-0">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

const DEVICE_ICONS: Record<string, LucideIcon> = {
  Mobile: Smartphone,
  Tablet: Tablet,
  Desktop: Monitor,
  Bot: Globe
};

function DevicesList({ items }: { items: { label: string; value: number }[] }) {
  if (items.length === 0) {
    return (
      <div className="text-text-muted text-sm text-center py-10 border border-dashed border-white/10 rounded-lg">
        Pas encore de visites.
      </div>
    );
  }
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <ul className="space-y-3">
      {items.map((it) => {
        const Icon = DEVICE_ICONS[it.label] ?? Monitor;
        const pct = Math.round((it.value / total) * 100);
        return (
          <li key={it.label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold text-white">{it.label}</span>
                <span className="text-xs text-text-muted">{pct}% — {it.value}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
