"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Edit, Eye, EyeOff, HelpCircle, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { useToast } from "@/components/Toast";
import { useConfirm } from "./Confirm";
import { apiCreateFaq, apiDeleteFaq, apiListFaq, apiUpdateFaq } from "./api";
import type { FaqItem } from "@/lib/types";

const empty = (): Partial<FaqItem> => ({
  question: "",
  answer: "",
  published: true
});

type Editing = { mode: "create" } | { mode: "edit"; item: FaqItem } | null;

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const router = useRouter();

  const refresh = async () => {
    try {
      const data = await apiListFaq();
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

  const remove = async (item: FaqItem) => {
    const ok = await confirm({
      title: "Supprimer cette question ?",
      message: item.question,
      danger: true,
      confirmText: "Supprimer"
    });
    if (!ok) return;
    try {
      await apiDeleteFaq(item.id);
      toast("FAQ supprimée.", "check");
      refresh();
    } catch {
      toast("Suppression impossible", "error");
    }
  };

  const togglePublish = async (item: FaqItem) => {
    try {
      await apiUpdateFaq(item.id, { published: !item.published });
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
        apiUpdateFaq(a.id, { order: b.order }),
        apiUpdateFaq(b.id, { order: a.order })
      ]);
      refresh();
    } catch {
      toast("Réordonnancement impossible", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">FAQ</h2>
          <p className="text-text-muted text-sm">
            Questions fréquentes. Les questions publiées apparaissent automatiquement sur la page d&apos;accueil.
          </p>
        </div>
        <button
          onClick={() => setEditing({ mode: "create" })}
          className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-light transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvelle question
        </button>
      </div>

      {loading ? (
        <div className="empty-state glass-panel">
          <p className="text-text-muted text-sm">Chargement…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state glass-panel">
          <HelpCircle className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-bold mt-4 mb-2">Aucune FAQ</h3>
          <p className="text-text-muted text-sm">Ajoutez votre première question fréquente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={it.id} className="glass-panel p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-white text-base">{it.question}</h3>
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
              <p className="text-sm text-text-muted whitespace-pre-wrap">{it.answer}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                {!it.published && (
                  <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                    Brouillon
                  </span>
                )}
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setEditing({ mode: "edit", item: it })}
                    className="text-xs font-semibold text-text-muted hover:text-white py-1.5 px-3 rounded border border-white/10 hover:bg-white/5 flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" /> Modifier
                  </button>
                  <button
                    onClick={() => togglePublish(it)}
                    className="text-xs font-semibold text-text-muted hover:text-white py-1.5 px-3 rounded border border-white/10 hover:bg-white/5"
                    title={it.published ? "Dépublier" : "Publier"}
                  >
                    {it.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => remove(it)}
                    className="text-xs font-semibold text-text-muted hover:text-red-400 py-1.5 px-3 rounded border border-white/10 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Editor editing={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
    </div>
  );
}

function Editor({
  editing,
  onClose,
  onSaved
}: {
  editing: Editing;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<FaqItem>>(empty());
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const isOpen = editing !== null;
  const isEdit = editing?.mode === "edit";
  const initial = useMemo(() => (isEdit ? { ...editing!.item } : empty()), [editing, isEdit]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setForm(initial), [editing]);

  const setField = <K extends keyof FaqItem>(k: K, v: FaqItem[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && editing) {
        await apiUpdateFaq(editing.item.id, form);
        toast("FAQ mise à jour.", "check");
      } else {
        await apiCreateFaq(form);
        toast("FAQ créée.", "check");
      }
      onSaved();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Échec", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={isEdit ? "Modifier la question" : "Nouvelle question"}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Question</label>
          <input
            type="text"
            value={form.question ?? ""}
            onChange={(e) => setField("question", e.target.value)}
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Réponse</label>
          <textarea
            rows={5}
            value={form.answer ?? ""}
            onChange={(e) => setField("answer", e.target.value)}
            className="w-full input-style rounded-lg px-4 py-2 text-sm resize-none"
            required
          />
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
