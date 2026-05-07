"use client";

import { useEffect, useState } from "react";
import { Download, Inbox, Mail, Trash2 } from "lucide-react";
import { apiDeleteLead, apiListLeads, apiUpdateLead } from "./api";
import { useToast } from "@/components/Toast";
import { useConfirm } from "./Confirm";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Nouveau",
  "in-progress": "En cours",
  won: "Gagné",
  archived: "Archivé"
};

const STATUS_CLASS: Record<LeadStatus, string> = {
  new: "bg-brand/20 text-brand border-brand/30",
  "in-progress": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  won: "bg-green-500/20 text-green-400 border-green-500/30",
  archived: "bg-white/10 text-text-muted border-white/10"
};

function csvEscape(s: string) {
  return `"${String(s ?? "").replace(/"/g, '""')}"`;
}

function exportCsv(leads: Lead[]) {
  const header = ["Reçu", "Nom", "Email", "Budget", "Statut", "Message"].join(",");
  const rows = leads.map((l) =>
    [
      new Date(l.receivedAt).toLocaleString("fr-FR"),
      l.name,
      l.email,
      l.budget,
      STATUS_LABEL[l.status],
      l.message
    ]
      .map(csvEscape)
      .join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const confirm = useConfirm();

  const refresh = async () => {
    try {
      setLeads(await apiListLeads());
    } catch (e) {
      toast(e instanceof Error ? e.message : "Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 20_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: number, status: LeadStatus) => {
    setLeads((curr) => curr.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await apiUpdateLead(id, status);
    } catch {
      toast("Mise à jour impossible", "error");
      refresh();
    }
  };

  const remove = async (lead: Lead) => {
    const ok = await confirm({
      title: "Supprimer ce lead ?",
      message: `${lead.name} — cette action est irréversible.`,
      danger: true,
      confirmText: "Supprimer"
    });
    if (!ok) return;
    try {
      await apiDeleteLead(lead.id);
      setLeads((curr) => curr.filter((l) => l.id !== lead.id));
      toast("Lead supprimé.", "check");
    } catch {
      toast("Suppression impossible", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Boîte de réception</h2>
          <p className="text-text-muted text-sm">Tous les contacts reçus via le formulaire du site.</p>
        </div>
        <button
          onClick={() => exportCsv(leads)}
          disabled={leads.length === 0}
          className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      {loading ? (
        <div className="empty-state glass-panel">
          <p className="text-text-muted text-sm">Chargement…</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="empty-state glass-panel">
          <Inbox className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-bold mt-4 mb-2">Aucun lead</h3>
          <p className="text-text-muted text-sm">
            Les contacts du formulaire du site apparaîtront ici en temps réel.
          </p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="p-4 font-semibold">Nom & Email</th>
                  <th className="p-4 font-semibold">Budget</th>
                  <th className="p-4 font-semibold">Message</th>
                  <th className="p-4 font-semibold">Reçu</th>
                  <th className="p-4 font-semibold">Statut</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 align-top">
                      <div className="font-bold text-white">{l.name}</div>
                      <a
                        href={`mailto:${l.email}`}
                        className="text-xs text-text-muted hover:text-brand inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> {l.email}
                      </a>
                    </td>
                    <td className="p-4 align-top text-white/80 whitespace-nowrap">{l.budget || "—"}</td>
                    <td className="p-4 align-top text-white/80 max-w-md">
                      <p className="line-clamp-3">{l.message}</p>
                    </td>
                    <td className="p-4 align-top text-text-muted text-xs whitespace-nowrap">
                      {new Date(l.receivedAt).toLocaleString("fr-FR")}
                    </td>
                    <td className="p-4 align-top">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                        className={`text-xs font-bold px-2 py-1 rounded-full border bg-transparent cursor-pointer ${STATUS_CLASS[l.status]}`}
                      >
                        {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((k) => (
                          <option key={k} value={k} className="bg-dark">
                            {STATUS_LABEL[k]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 align-top text-right">
                      <button
                        onClick={() => remove(l)}
                        className="text-text-muted hover:text-red-400 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
