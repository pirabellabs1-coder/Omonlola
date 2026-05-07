"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Edit,
  EyeOff,
  Eye,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  Mic,
  Plus,
  Rocket,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
  type LucideIcon
} from "lucide-react";
import Modal from "./Modal";
import { useToast } from "@/components/Toast";
import { useConfirm } from "./Confirm";
import { apiCreateCase, apiDeleteCase, apiListCases, apiUpdateCase } from "./api";
import type { CaseItem, CaseSector, Kpi } from "@/lib/types";

const SECTORS: CaseSector[] = ["E-commerce", "SaaS & B2B", "Info-produit", "Coaching"];

export const ICONS: Record<string, LucideIcon> = {
  "shopping-bag": ShoppingBag,
  users: Users,
  mic: Mic,
  "book-open": BookOpen,
  rocket: Rocket,
  "trending-up": TrendingUp
};

type Editing =
  | { mode: "create" }
  | { mode: "edit"; item: CaseItem }
  | null;

const empty = (): Partial<CaseItem> => ({
  title: "",
  client: "",
  sector: "E-commerce",
  description: "",
  body: "",
  image: "",
  icon: "shopping-bag",
  kpis: [{ name: "", value: "" }],
  published: true
});

export default function CasesPage() {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const router = useRouter();

  const refresh = async () => {
    try {
      setItems(await apiListCases());
      router.refresh(); // invalidate RSC cache so / shows fresh data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const remove = async (item: CaseItem) => {
    const ok = await confirm({
      title: "Supprimer cette réalisation ?",
      message: item.title,
      danger: true,
      confirmText: "Supprimer"
    });
    if (!ok) return;
    try {
      await apiDeleteCase(item.id);
      toast("Réalisation supprimée.", "check");
      refresh();
    } catch {
      toast("Suppression impossible", "error");
    }
  };

  const togglePublish = async (item: CaseItem) => {
    try {
      await apiUpdateCase(item.id, { published: !item.published });
      refresh();
    } catch {
      toast("Mise à jour impossible", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Réalisations</h2>
          <p className="text-text-muted text-sm">
            Vos études de cas. Les réalisations publiées apparaissent automatiquement sur la page d&apos;accueil.
          </p>
        </div>
        <button
          onClick={() => setEditing({ mode: "create" })}
          className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-light transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvelle étude
        </button>
      </div>

      {loading ? (
        <div className="empty-state glass-panel">
          <p className="text-text-muted text-sm">Chargement…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state glass-panel">
          <FolderKanban className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-bold mt-4 mb-2">Aucune réalisation</h3>
          <p className="text-text-muted text-sm">Ajoutez votre première étude de cas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => {
            const Icon = ICONS[c.icon] ?? ShoppingBag;
            return (
              <div key={c.id} className="glass-panel overflow-hidden">
                <div className="relative h-40 bg-dark">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover opacity-70"
                      onError={(e) => ((e.currentTarget.style.display = "none"))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Icon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-white flex items-center gap-1">
                    <Icon className="w-3 h-3" /> {c.sector}
                  </div>
                  {!c.published && (
                    <div className="absolute top-3 right-3 bg-amber-500/30 text-amber-200 text-[10px] font-bold px-2 py-1 rounded-full">
                      Brouillon
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 text-white">{c.title}</h3>
                  <p className="text-xs text-text-muted line-clamp-2 mb-3">{c.description || "—"}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.kpis.map((k) => (
                      <span
                        key={k.name}
                        className="text-[10px] uppercase tracking-wider font-bold bg-white/5 px-2 py-1 rounded border border-white/10"
                      >
                        {k.name}: <span className="text-brand">{k.value}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <button
                      onClick={() => setEditing({ mode: "edit", item: c })}
                      className="flex-1 text-xs font-semibold text-text-muted hover:text-white py-1.5 rounded border border-white/10 hover:bg-white/5 flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" /> Modifier
                    </button>
                    <button
                      onClick={() => togglePublish(c)}
                      className="text-xs font-semibold text-text-muted hover:text-white py-1.5 px-3 rounded border border-white/10 hover:bg-white/5 flex items-center gap-1"
                    >
                      {c.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => remove(c)}
                      className="text-xs font-semibold text-text-muted hover:text-red-400 py-1.5 px-3 rounded border border-white/10 hover:bg-red-500/10 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CaseEditor
        editing={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
    </div>
  );
}

function CaseEditor({
  editing,
  onClose,
  onSaved
}: {
  editing: Editing;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<CaseItem>>(empty());
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const isOpen = editing !== null;
  const isEdit = editing?.mode === "edit";

  // Reset form when opening
  const initial = useMemo(() => (isEdit ? { ...editing!.item } : empty()), [editing, isEdit]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setForm(initial), [editing]);

  const setField = <K extends keyof CaseItem>(k: K, v: CaseItem[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setKpi = (i: number, k: Partial<Kpi>) => {
    setForm((f) => {
      const arr = [...(f.kpis ?? [])];
      arr[i] = { ...arr[i], ...k } as Kpi;
      return { ...f, kpis: arr };
    });
  };

  const addKpi = () =>
    setForm((f) => ({ ...f, kpis: [...(f.kpis ?? []), { name: "", value: "" }] }));
  const removeKpi = (i: number) =>
    setForm((f) => ({ ...f, kpis: (f.kpis ?? []).filter((_, idx) => idx !== i) }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && editing) {
        await apiUpdateCase(editing.item.id, form);
        toast("Réalisation mise à jour.", "check");
      } else {
        await apiCreateCase(form);
        toast("Réalisation créée.", "check");
      }
      onSaved();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Échec", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={isEdit ? "Modifier la réalisation" : "Nouvelle réalisation"}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Titre">
          <input
            type="text"
            value={form.title ?? ""}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="ex: Doublé du ROAS en 60 jours"
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
            required
          />
        </Field>
        <Field label="Nom du client (optionnel — affiché en sous-titre)">
          <input
            type="text"
            value={form.client ?? ""}
            onChange={(e) => setField("client", e.target.value)}
            placeholder="ex: Marque Cosmétique Bio"
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
          />
        </Field>
        <Field label="Secteur">
          <select
            value={form.sector ?? "E-commerce"}
            onChange={(e) => setField("sector", e.target.value as CaseSector)}
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
            required
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description courte (1 phrase d'accroche)">
          <textarea
            rows={2}
            value={form.description ?? ""}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Une phrase de description (utilisée sur la carte de la home)"
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
          />
        </Field>
        <Field label="Contenu détaillé (étude de cas — affiché au clic 'Lire l'étude')">
          <textarea
            rows={8}
            value={form.body ?? ""}
            onChange={(e) => setField("body", e.target.value)}
            placeholder={`Contexte\nLes objectifs et la situation de départ.\n\nApproche\nCe qui a été mis en place : tracking CAPI, structure des campagnes, créatives, scaling…\n\nRésultats\nLes chiffres et l'impact business.`}
            className="w-full input-style rounded-lg px-4 py-3 text-sm font-mono leading-relaxed resize-y"
          />
          <p className="text-[10px] text-text-muted mt-1">
            Une ligne vide sépare les paragraphes. Vous pouvez utiliser des titres simples (ex : “Contexte”, “Approche”, “Résultats”).
          </p>
        </Field>
        <Field label="Image de la réalisation">
          <ImageUploader value={form.image ?? ""} onChange={(url) => setField("image", url)} />
        </Field>
        <Field label="Icône catégorie">
          <select
            value={form.icon ?? "shopping-bag"}
            onChange={(e) => setField("icon", e.target.value)}
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
          >
            <option value="shopping-bag">shopping-bag (E-commerce)</option>
            <option value="users">users (B2B)</option>
            <option value="mic">mic (Coaching)</option>
            <option value="book-open">book-open (Info-produit)</option>
            <option value="rocket">rocket (Startup)</option>
            <option value="trending-up">trending-up (Croissance)</option>
          </select>
        </Field>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-text-muted uppercase">KPIs (max 4)</label>
            {(form.kpis?.length ?? 0) < 4 && (
              <button type="button" onClick={addKpi} className="text-xs text-brand hover:underline">
                + Ajouter
              </button>
            )}
          </div>
          <div className="space-y-2">
            {(form.kpis ?? []).map((k, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  type="text"
                  value={k.name}
                  onChange={(e) => setKpi(i, { name: e.target.value })}
                  placeholder="ex: ROAS"
                  className="input-style rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={k.value}
                  onChange={(e) => setKpi(i, { value: e.target.value })}
                  placeholder="ex: 4.2x"
                  className="input-style rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeKpi(i)}
                  className="text-text-muted hover:text-red-400 px-2"
                  aria-label="Retirer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published ?? true}
            onChange={(e) => setField("published", e.target.checked)}
            className="accent-brand"
          />
          <span className="text-white/80">Publier sur le site public</span>
        </label>
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

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value && value.startsWith("http") ? "url" : "upload");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast("Veuillez sélectionner une image.", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast("Image trop volumineuse (max 8 Mo).", "error");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Échec de l'upload");
      onChange(data.url as string);
      toast("Image uploadée.", "check");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Échec de l'upload", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            mode === "upload" ? "bg-brand text-white" : "bg-white/5 text-text-muted hover:bg-white/10"
          }`}
        >
          <Upload className="inline w-3 h-3 mr-1" /> Galerie
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            mode === "url" ? "bg-brand text-white" : "bg-white/5 text-text-muted hover:bg-white/10"
          }`}
        >
          <ImageIcon className="inline w-3 h-3 mr-1" /> URL externe
        </button>
      </div>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 mb-2 bg-dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Aperçu" className="w-full h-44 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500"
            aria-label="Retirer l'image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {mode === "upload" ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.currentTarget.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-white/15 rounded-lg p-6 text-center hover:border-brand/50 hover:bg-brand/5 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 mx-auto mb-2 text-brand animate-spin" />
                <div className="text-sm text-white/80">Envoi…</div>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 mx-auto mb-2 text-text-muted" />
                <div className="text-sm font-semibold text-white">
                  {value ? "Remplacer l'image" : "Choisir depuis votre galerie"}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  JPG · PNG · WEBP · GIF · AVIF — 8 Mo max
                </div>
              </>
            )}
          </button>
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full input-style rounded-lg px-4 py-2 text-sm"
        />
      )}
    </div>
  );
}
