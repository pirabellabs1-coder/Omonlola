"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { apiActivity } from "./api";
import type { ActivityEntry } from "@/lib/types";

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await apiActivity();
        if (!cancelled) setItems(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Journal d&apos;activité</h2>
        <p className="text-text-muted text-sm">Historique des dernières actions du back-office.</p>
      </div>

      {loading ? (
        <div className="empty-state glass-panel">
          <p className="text-text-muted text-sm">Chargement…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state glass-panel">
          <Clock className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-bold mt-4 mb-2">Aucune activité</h3>
          <p className="text-text-muted text-sm">Les actions apparaîtront ici en temps réel.</p>
        </div>
      ) : (
        <div className="glass-panel divide-y divide-white/5">
          {items.map((a) => (
            <div key={a.id} className="p-4 flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-white">
                  <span className="font-bold">{a.action}</span>
                  <span className="text-text-muted"> — {a.target}</span>
                </div>
                {a.details && <div className="text-xs text-text-muted mt-1">{a.details}</div>}
              </div>
              <div className="text-xs text-text-muted whitespace-nowrap">
                {new Date(a.at).toLocaleString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
