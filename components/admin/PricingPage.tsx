"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Star,
  Tag,
  Trash2,
  X
} from "lucide-react";
import Modal from "./Modal";
import { useToast } from "@/components/Toast";
import { useConfirm } from "./Confirm";
import { apiCreatePricing, apiDeletePricing, apiListPricing, apiUpdatePricing } from "./api";
import type { PricingPlan } from "@/lib/types";

const empty = (): Partial<PricingPlan> => ({
  name: "",
  description: "",
  price: "",
  unit: "",
  features: [""],
  cta: "Demander un devis",
  ctaLink: "#contact",
  popular: false,
  published: true
});

type Editing = { mode: "create" } | { mode: "edit"; item: PricingPlan } | null;

export default function PricingPage() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const router = useRouter();

  const refresh = async () => {
    try {
      const data = await apiListPricing();
      setItems(data.sort((a, b) => a.order - b.order));
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (item: PricingPlan) => {
    const ok = await confirm({
      title: "Supprimer cette offre ?",
      message: item.name,
      danger: true,
      confirmText: "Supprimer"
    });
    if (!ok) return;
    try {
      await apiDeletePricing(item.id);
      toast("Offre supprimée.", "check");
      refresh();
    } catch {
      toast("Suppression impossible", "error");
    }
  };

  const togglePublish = async (item: PricingPlan) => {
    try {
      await apiUpdatePricing(item.id, { published: !item.published });
      refresh();
    } catch {
      toast("Mise à jour impossible", "error");
    }
  };

  const togglePopular = async (item: PricingPlan) => {
    try {
      // ensure only one popular: if turning on, turn off others
      if (!item.popular) {
        await Promise.all(
          items.filter((p) => p.popular && p.id !== item.id).map((p) => apiUpdatePricing(p.id, { popular: false }))
        );
      }
      await apiUpdatePricing(item.id, { popular: !item.popular });
      refresh();
    } catch {
      toast("Mise à jour impossible", "error");
    }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= items.length) return;
    const a = items[idx];
    const b = items[newIdx];
    try {
      await Promise.all([
        apiUpdatePricing(a.id, { order: b.order }),
        apiUpdatePricing(b.id, { order: a.order })
      ]);
      refresh();
    } catch {
      toast("Réordonnancement impossible", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Tarifs / Offres</h2>
          <p className="text-text-muted text-sm">
            Gérez vos forfaits. Les offres publiées apparaissent automatiquement dans la section &quot;Tarifs&quot;
            de la page d&apos;accueil.
          </p>
        </div>
        <button
          onClick={() => setEditing({ mode: "create" })}
          className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-light transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvelle offre
        </button>
      </div>

      {loading ? (
        <div className="empty-state glass-panel">
          <p className="text-text-muted text-sm">Chargement…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state glass-panel">
          <Tag className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-bold mt-4 mb-2">Aucune offre</h3>
          <p className="text-text-muted text-sm">
            Créez votre première offre — elle apparaîtra automatiquement sur la page d&apos;accueil.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <div
              key={p.id}
              className={`glass-panel p-6 relative ${
                p.popular ? "!border-brand/50 shadow-[0_0_30px_rgba(0,102,255,0.15)]" : ""
              }`}
            >
              {p.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Populaire
                </div>
              )}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg uppercase tracking-wide text-white">{p.name}</h3>
                  <p className="text-xs text-text-muted line-clamp-1">{p.description || "—"}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="text-text-muted hover:text-white disabled:opacity-30"
                    aria-label="Monter"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="text-text-muted hover:text-white disabled:opacity-30"
                    aria-label="Descendre"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-2xl font-display font-bold text-white mb-3">
                {p.price || "—"}{" "}
                {p.unit && <span className="text-xs text-text-muted font-sans font-normal">{p.unit}</span>}
              </div>

              {p.features.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {p.features.slice(0, 4).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                      <Check className="w-3 h-3 text-brand shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{f}</span>
                    </li>
                  ))}
                  {p.features.length > 4 && (
                    <li className="text-[10px] text-text-muted">+ {p.features.length - 4} autre(s)</li>
                  )}
                </ul>
              )}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {!p.published && (
                  <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    Brouillon
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold bg-white/5 text-text-muted px-2 py-0.5 rounded">
                  CTA: {p.cta}
                </span>
              </div>

              <div className="flex gap-2 border-t border-white/5 pt-3">
                <button
                  onClick={() => setEditing({ mode: "edit", item: p })}
                  className="flex-1 text-xs font-semibold text-text-muted hover:text-white py-1.5 rounded border border-white/10 hover:bg-white/5 flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" /> Modifier
                </button>
                <button
                  onClick={() => togglePopular(p)}
                  className={`text-xs font-semibold py-1.5 px-2.5 rounded border transition-colors ${
                    p.popular
                      ? "border-brand/40 text-brand hover:bg-brand/10"
                      : "border-white/10 text-text-muted hover:text-white hover:bg-white/5"
                  }`}
                  title={p.popular ? "Retirer de Populaire" : "Marquer comme Populaire"}
                >
                  <Star className={`w-3 h-3 ${p.popular ? "fill-brand" : ""}`} />
                </button>
                <button
                  onClick={() => togglePublish(p)}
                  className="text-xs font-semibold text-text-muted hover:text-white py-1.5 px-2.5 rounded border border-white/10 hover:bg-white/5"
                  title={p.published ? "Dépublier" : "Publier"}
                >
                  {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => remove(p)}
                  className="text-xs font-semibold text-text-muted hover:text-red-400 py-1.5 px-2.5 rounded border border-white/10 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Editor
        editing={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
        existingPopularId={items.find((p) => p.popular)?.id ?? null}
        currentItems={items}
      />
    </div>
  );
}

function Editor({
  editing,
  onClose,
  onSaved,
  existingPopularId,
  currentItems
}: {
  editing: Editing;
  onClose: () => void;
  onSaved: () => void;
  existingPopularId: number | null;
  currentItems: PricingPlan[];
}) {
  const [form, setForm] = useState<Partial<PricingPlan>>(empty());
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const isOpen = editing !== null;
  const isEdit = editing?.mode === "edit";
  const initial = useMemo(() => (isEdit ? { ...editing!.item } : empty()), [editing, isEdit]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setForm(initial), [editing]);

  const setField = <K extends keyof PricingPlan>(k: K, v: PricingPlan[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setFeature = (i: number, v: string) =>
    setForm((f) => {
      const arr = [...(f.features ?? [])];
      arr[i] = v;
      return { ...f, features: arr };
    });

  const addFeature = () =>
    setForm((f) => ({ ...f, features: [...(f.features ?? []), ""] }));

  const removeFeature = (i: number) =>
    setForm((f) => ({ ...f, features: (f.features ?? []).filter((_, idx) => idx !== i) }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // If marking this plan as Popular, demote any other plan first
    const willBePopular = Boolean(form.popular);

    try {
      // Demote others if needed
      if (willBePopular && existingPopularId && (!isEdit || editing!.item.id !== existingPopularId)) {
        await apiUpdatePricing(existingPopularId, { popular: false });
      }
      // Also if we're editing the currently-popular plan and unchecking, that's fine
      // Demote any other plan in currentItems with popular=true that isn't the current one
      const currentEditId = isEdit ? editing!.item.id : -1;
      if (willBePopular) {
        await Promise.all(
          currentItems
            .filter((p) => p.popular && p.id !== currentEditId)
            .map((p) => apiUpdatePricing(p.id, { popular: false }))
        );
      }

      if (isEdit && editing) {
        await apiUpdatePricing(editing.item.id, form);
        toast("Offre mise à jour.", "check");
      } else {
        await apiCreatePricing(form);
        toast("Offre créée.", "check");
      }
      onSaved();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Échec", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={isEdit ? "Modifier l'offre" : "Nouvelle offre"}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nom de l'offre">
          <input
            type="text"
            value={form.name ?? ""}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="ex: Growth"
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
            required
            autoFocus
          />
        </Field>

        <Field label="Description courte">
          <input
            type="text"
            value={form.description ?? ""}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="ex: Gestion complète mensuelle."
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Prix (libre)">
            <input
              type="text"
              value={form.price ?? ""}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="ex: Dès 800€  ou  Sur devis"
              className="w-full input-style rounded-lg px-4 py-2 text-sm"
            />
          </Field>
          <Field label="Unité (optionnel)">
            <input
              type="text"
              value={form.unit ?? ""}
              onChange={(e) => setField("unit", e.target.value)}
              placeholder="ex: / mois"
              className="w-full input-style rounded-lg px-4 py-2 text-sm"
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-text-muted uppercase">
              Caractéristiques (max 12)
            </label>
            {(form.features?.length ?? 0) < 12 && (
              <button type="button" onClick={addFeature} className="text-xs text-brand hover:underline">
                + Ajouter
              </button>
            )}
          </div>
          <div className="space-y-2">
            {(form.features ?? []).map((f, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  type="text"
                  value={f}
                  onChange={(e) => setFeature(i, e.target.value)}
                  placeholder={`Caractéristique ${i + 1}`}
                  className="input-style rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-text-muted hover:text-red-400 px-2"
                  aria-label="Retirer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Texte du bouton (CTA)">
            <input
              type="text"
              value={form.cta ?? ""}
              onChange={(e) => setField("cta", e.target.value)}
              placeholder="ex: Démarrer la croissance"
              className="w-full input-style rounded-lg px-4 py-2 text-sm"
            />
          </Field>
          <Field label="Lien du bouton">
            <input
              type="text"
              value={form.ctaLink ?? ""}
              onChange={(e) => setField("ctaLink", e.target.value)}
              placeholder="#contact ou https://..."
              className="w-full input-style rounded-lg px-4 py-2 text-sm"
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.popular ?? false}
              onChange={(e) => setField("popular", e.target.checked)}
              className="accent-brand"
            />
            <Star className="w-4 h-4 text-brand" />
            <span className="text-white/80">Marquer comme &quot;Populaire&quot; (mis en avant — un seul à la fois)</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published ?? true}
              onChange={(e) => setField("published", e.target.checked)}
              className="accent-brand"
            />
            <span className="text-white/80">Publier sur le site public</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand text-white font-bold py-2.5 rounded-lg hover:bg-brand-light transition-colors disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-muted uppercase mb-1">{label}</label>
      {children}
    </div>
  );
}
