"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { apiGetSettings, apiPutSettings } from "./api";
import { useToast } from "@/components/Toast";
import type { Settings } from "@/lib/types";

const DEFAULTS: Settings = {
  displayName: "Omonlola Admin",
  notifyEmail: "",
  whatsapp: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoOgImage: "",
  seoSiteUrl: ""
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    apiGetSettings()
      .then((s) => setForm(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await apiPutSettings(form);
      setForm(saved);
      router.refresh();
      toast("Paramètres sauvegardés.", "check");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Échec", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="empty-state glass-panel">
          <p className="text-text-muted text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  const titleLen = form.seoTitle.length;
  const descLen = form.seoDescription.length;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h2 className="text-2xl font-bold mb-2">Paramètres</h2>
      <p className="text-text-muted text-sm mb-8">
        Identité du back-office et SEO de la page d&apos;accueil.
      </p>

      <form onSubmit={submit} className="space-y-6">
        {/* General */}
        <div className="glass-panel p-8 space-y-5">
          <h3 className="font-bold text-lg text-white">Général</h3>
          <Field label="Nom d'affichage">
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
              required
            />
          </Field>
          <Field label="Email de notification (optionnel)">
            <input
              type="email"
              value={form.notifyEmail}
              onChange={(e) => setForm({ ...form, notifyEmail: e.target.value })}
              placeholder="vous@domaine.com"
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
            />
          </Field>
          <Field label="Numéro WhatsApp (E.164, ex: 22900000000)">
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/[^0-9]/g, "") })}
              placeholder="22900000000"
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
            />
            <p className="text-xs text-text-muted mt-1">
              Utilisé par le bouton &quot;Échanger via WhatsApp&quot; sur la page d&apos;accueil.
            </p>
          </Field>
        </div>

        {/* SEO */}
        <div className="glass-panel p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">SEO de la page d&apos;accueil</h3>
            <span className="text-[10px] uppercase tracking-wider bg-brand/15 text-brand px-2 py-1 rounded-full font-bold">
              Live
            </span>
          </div>
          <p className="text-text-muted text-sm -mt-2">
            Ces champs alimentent directement les balises <code>&lt;title&gt;</code>,{" "}
            <code>&lt;meta description&gt;</code>, Open Graph et Twitter Card de la page d&apos;accueil.
          </p>

          <Field
            label="Titre (title)"
            hint={
              <span
                className={`text-[10px] font-mono ${
                  titleLen > 60 ? "text-amber-300" : "text-text-muted"
                }`}
              >
                {titleLen}/60 idéal
              </span>
            }
          >
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              placeholder="Omonlola | Meta Ads Specialist"
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
            />
          </Field>

          <Field
            label="Meta description"
            hint={
              <span
                className={`text-[10px] font-mono ${
                  descLen > 160 ? "text-amber-300" : "text-text-muted"
                }`}
              >
                {descLen}/160 idéal
              </span>
            }
          >
            <textarea
              rows={3}
              value={form.seoDescription}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              placeholder="Une phrase qui décrit votre activité…"
              className="w-full input-style rounded-lg px-4 py-3 text-sm resize-none"
            />
          </Field>

          <Field label="Mots-clés (séparés par des virgules)">
            <input
              type="text"
              value={form.seoKeywords}
              onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
              placeholder="meta ads, media buyer, roas"
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
            />
          </Field>

          <Field label="URL canonique du site (optionnel)">
            <input
              type="url"
              value={form.seoSiteUrl}
              onChange={(e) => setForm({ ...form, seoSiteUrl: e.target.value })}
              placeholder="https://omonlola.ai"
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
            />
          </Field>

          <Field label="Image de partage (Open Graph)">
            <OgImageField
              value={form.seoOgImage}
              onChange={(url) => setForm({ ...form, seoOgImage: url })}
            />
          </Field>

          {/* SERP preview */}
          <div className="border border-white/10 rounded-lg p-4 bg-black/30">
            <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-2">
              Aperçu Google
            </div>
            <div className="text-[#aac2ff] text-base font-medium truncate">
              {form.seoTitle || "Titre de la page"}
            </div>
            <div className="text-[#7faf6c] text-xs truncate">{form.seoSiteUrl || "votre-site.com"}</div>
            <div className="text-[#bdc1c6] text-sm mt-1 line-clamp-2">
              {form.seoDescription || "La description s'affichera ici."}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-light transition-colors disabled:opacity-60 sticky bottom-4 shadow-[0_0_20px_rgba(0,102,255,0.3)]"
        >
          {saving ? "Sauvegarde…" : "Sauvegarder les paramètres"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</label>
        {hint}
      </div>
      {children}
    </div>
  );
}

function OgImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast("Veuillez sélectionner une image.", "error");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload échoué");
      onChange(data.url);
      toast("Image uploadée.", "check");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Échec", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-white/10 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="og:image" className="w-full h-44 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500"
            aria-label="Retirer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
          <ImagePlus className="w-8 h-8 mx-auto text-text-muted mb-2" />
          <p className="text-xs text-text-muted">1200×630 px recommandé pour Open Graph</p>
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Envoi…
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4" /> {value ? "Remplacer" : "Uploader depuis la galerie"}
            </>
          )}
        </button>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ou collez une URL"
          className="flex-1 input-style rounded-lg px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
