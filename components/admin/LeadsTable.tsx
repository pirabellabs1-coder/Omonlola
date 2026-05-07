"use client";

import { Inbox, Mail } from "lucide-react";

export type Lead = {
  id: number;
  receivedAt: string;
  name: string;
  email: string;
  budget: string;
  message: string;
};

export default function LeadsTable({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="empty-state glass-panel">
        <p className="text-text-muted text-sm">Chargement…</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <Inbox className="w-12 h-12 text-text-muted mx-auto" />
        <h3 className="text-lg font-bold mt-4 mb-2">Aucun lead</h3>
        <p className="text-text-muted text-sm">
          Les contacts envoyés via le formulaire du site apparaîtront ici en temps réel.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-wider border-b border-white/10">
              <th className="p-4 font-semibold">Nom & Email</th>
              <th className="p-4 font-semibold">Budget</th>
              <th className="p-4 font-semibold">Message</th>
              <th className="p-4 font-semibold">Reçu</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="font-bold text-white">{l.name}</div>
                  <a
                    href={`mailto:${l.email}`}
                    className="text-xs text-text-muted hover:text-brand inline-flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" /> {l.email}
                  </a>
                </td>
                <td className="p-4 text-white/80">{l.budget || "—"}</td>
                <td className="p-4 text-white/80 max-w-md">
                  <p className="line-clamp-2">{l.message}</p>
                </td>
                <td className="p-4 text-text-muted text-xs whitespace-nowrap">
                  {new Date(l.receivedAt).toLocaleString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
