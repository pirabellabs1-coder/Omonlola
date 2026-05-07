"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Mail,
  MessageSquare,
  Plus,
  Star,
  Trash2,
  UserPlus
} from "lucide-react";
import Modal from "./Modal";
import { useToast } from "@/components/Toast";
import { useConfirm } from "./Confirm";
import {
  apiCreateReview,
  apiDeleteReview,
  apiDeleteReviewRequest,
  apiListReviewRequests,
  apiListReviews,
  apiUpdateReview
} from "./api";
import InviteReviewModal from "./InviteReviewModal";
import type { Review, ReviewRequest } from "@/lib/types";

const empty = (): Partial<Review> => ({
  name: "",
  role: "",
  company: "",
  avatar: "",
  rating: 5,
  content: "",
  published: true
});

type Editing = { mode: "create" } | { mode: "edit"; item: Review } | null;
type Tab = "list" | "invitations";

export default function ReviewsPage() {
  const [tab, setTab] = useState<Tab>("list");
  const [items, setItems] = useState<Review[]>([]);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const toast = useToast();
  const confirm = useConfirm();
  const router = useRouter();

  const refresh = async () => {
    try {
      const [revs, reqs] = await Promise.all([apiListReviews(), apiListReviewRequests()]);
      setItems(revs);
      setRequests(reqs);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (item: Review) => {
    const ok = await confirm({
      title: "Supprimer ce témoignage ?",
      message: item.name,
      danger: true,
      confirmText: "Supprimer"
    });
    if (!ok) return;
    try {
      await apiDeleteReview(item.id);
      toast("Témoignage supprimé.", "check");
      refresh();
    } catch {
      toast("Suppression impossible", "error");
    }
  };

  const togglePublish = async (item: Review) => {
    try {
      await apiUpdateReview(item.id, { published: !item.published });
      refresh();
    } catch {
      toast("Mise à jour impossible", "error");
    }
  };

  const removeRequest = async (req: ReviewRequest) => {
    const ok = await confirm({
      title: "Supprimer cette invitation ?",
      message: req.clientName,
      danger: true,
      confirmText: "Supprimer"
    });
    if (!ok) return;
    try {
      await apiDeleteReviewRequest(req.id);
      toast("Invitation supprimée.", "check");
      refresh();
    } catch {
      toast("Suppression impossible", "error");
    }
  };

  const pendingCount = requests.filter((r) => !r.submittedAt).length;
  const pendingReviewCount = items.filter((r) => !r.published).length;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Témoignages</h2>
          <p className="text-text-muted text-sm">
            Avis clients. Les témoignages publiés apparaissent automatiquement sur la page d&apos;accueil.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInviteOpen(true)}
            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-brand/10 hover:border-brand/30 transition-colors"
          >
            <UserPlus className="w-4 h-4 text-brand" /> Inviter un client
          </button>
          <button
            onClick={() => setEditing({ mode: "create" })}
            className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-light transition-colors"
          >
            <Plus className="w-4 h-4" /> Nouvel avis
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5 mb-6">
        <TabBtn active={tab === "list"} onClick={() => setTab("list")}>
          Témoignages
          <span className="ml-2 bg-white/5 px-2 py-0.5 rounded text-[10px]">{items.length}</span>
          {pendingReviewCount > 0 && (
            <span className="ml-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {pendingReviewCount} à valider
            </span>
          )}
        </TabBtn>
        <TabBtn active={tab === "invitations"} onClick={() => setTab("invitations")}>
          Invitations
          <span className="ml-2 bg-white/5 px-2 py-0.5 rounded text-[10px]">{requests.length}</span>
          {pendingCount > 0 && (
            <span className="ml-1 bg-brand/20 text-brand px-2 py-0.5 rounded-full text-[10px] font-bold">
              {pendingCount} en attente
            </span>
          )}
        </TabBtn>
      </div>

      {tab === "list" && (
        <ReviewsList
          loading={loading}
          items={items}
          onEdit={(it) => setEditing({ mode: "edit", item: it })}
          onTogglePublish={togglePublish}
          onRemove={remove}
        />
      )}

      {tab === "invitations" && (
        <InvitationsList
          loading={loading}
          requests={requests}
          onRemove={removeRequest}
          onCreate={() => setInviteOpen(true)}
        />
      )}

      <Editor editing={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
      <InviteReviewModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onCreated={refresh}
      />
    </div>
  );
}

function TabBtn({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center ${
        active ? "border-brand text-white" : "border-transparent text-text-muted hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ReviewsList({
  loading,
  items,
  onEdit,
  onTogglePublish,
  onRemove
}: {
  loading: boolean;
  items: Review[];
  onEdit: (item: Review) => void;
  onTogglePublish: (item: Review) => void;
  onRemove: (item: Review) => void;
}) {
  if (loading) {
    return (
      <div className="empty-state glass-panel">
        <p className="text-text-muted text-sm">Chargement…</p>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <MessageSquare className="w-12 h-12 text-text-muted mx-auto" />
        <h3 className="text-lg font-bold mt-4 mb-2">Aucun témoignage</h3>
        <p className="text-text-muted text-sm">
          Ajoutez un avis manuellement ou envoyez un lien à un client via &quot;Inviter un client&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((r) => (
        <div key={r.id} className="glass-panel p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold shrink-0 overflow-hidden">
              {r.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                r.name?.[0]?.toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white truncate flex items-center gap-2">
                {r.name}
                {r.source === "invited" && (
                  <span className="bg-brand/20 text-brand text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                    Invité
                  </span>
                )}
              </div>
              <div className="text-xs text-text-muted truncate">
                {[r.role, r.company].filter(Boolean).join(" · ") || "—"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-white/15"}`}
              />
            ))}
          </div>
          <p className="text-sm text-white/80 line-clamp-4 mb-4">{r.content}</p>
          {!r.published && (
            <div className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-1 rounded inline-block mb-3">
              En attente de publication
            </div>
          )}
          <div className="flex gap-2 border-t border-white/5 pt-3">
            <button
              onClick={() => onEdit(r)}
              className="flex-1 text-xs font-semibold text-text-muted hover:text-white py-1.5 rounded border border-white/10 hover:bg-white/5 flex items-center justify-center gap-1"
            >
              <Edit className="w-3 h-3" /> Modifier
            </button>
            <button
              onClick={() => onTogglePublish(r)}
              className={`text-xs font-semibold py-1.5 px-3 rounded border flex items-center gap-1 transition-colors ${
                r.published
                  ? "border-white/10 text-text-muted hover:text-white hover:bg-white/5"
                  : "border-brand/40 text-brand hover:bg-brand/10"
              }`}
              title={r.published ? "Dépublier" : "Publier"}
            >
              {r.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{r.published ? "Visible" : "Publier"}</span>
            </button>
            <button
              onClick={() => onRemove(r)}
              className="text-xs font-semibold text-text-muted hover:text-red-400 py-1.5 px-3 rounded border border-white/10 hover:bg-red-500/10"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function InvitationsList({
  loading,
  requests,
  onRemove,
  onCreate
}: {
  loading: boolean;
  requests: ReviewRequest[];
  onRemove: (r: ReviewRequest) => void;
  onCreate: () => void;
}) {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  if (loading) {
    return (
      <div className="empty-state glass-panel">
        <p className="text-text-muted text-sm">Chargement…</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <UserPlus className="w-12 h-12 text-text-muted mx-auto" />
        <h3 className="text-lg font-bold mt-4 mb-2">Aucune invitation</h3>
        <p className="text-text-muted text-sm mb-4">
          Envoyez un lien personnalisé à un client pour qu&apos;il laisse son avis.
        </p>
        <button
          onClick={onCreate}
          className="px-5 py-2.5 bg-brand text-white rounded-lg text-sm font-bold inline-flex items-center gap-2 hover:bg-brand-light"
        >
          <UserPlus className="w-4 h-4" /> Créer une invitation
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-wider border-b border-white/10">
              <th className="p-4 font-semibold">Client</th>
              <th className="p-4 font-semibold">Statut</th>
              <th className="p-4 font-semibold">Lien</th>
              <th className="p-4 font-semibold">Créé</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {requests.map((r) => {
              const url = `${origin}/review/${r.token}`;
              const submitted = Boolean(r.submittedAt);
              return (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 align-top">
                    <div className="font-bold text-white">{r.clientName}</div>
                    {r.clientEmail && (
                      <a
                        href={`mailto:${r.clientEmail}`}
                        className="text-xs text-text-muted hover:text-brand inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> {r.clientEmail}
                      </a>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    {submitted ? (
                      <span className="bg-green-500/20 text-green-400 text-[11px] font-bold px-2 py-1 rounded-full border border-green-500/30 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Reçu
                      </span>
                    ) : (
                      <span className="bg-brand/20 text-brand text-[11px] font-bold px-2 py-1 rounded-full border border-brand/30 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En attente
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <CopyableLink url={url} disabled={submitted} />
                  </td>
                  <td className="p-4 align-top text-text-muted text-xs whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-4 align-top text-right">
                    <button
                      onClick={() => onRemove(r)}
                      className="text-text-muted hover:text-red-400 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CopyableLink({ url, disabled }: { url: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Impossible de copier", "error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <code className={`text-[10px] font-mono truncate max-w-[260px] ${disabled ? "opacity-40" : ""}`}>
        {url}
      </code>
      {!disabled && (
        <button
          onClick={copy}
          className="text-text-muted hover:text-brand transition-colors"
          aria-label="Copier le lien"
          title="Copier le lien"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

/* ===================== Editor (manual review) ===================== */
function Editor({
  editing,
  onClose,
  onSaved
}: {
  editing: Editing;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Review>>(empty());
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const isOpen = editing !== null;
  const isEdit = editing?.mode === "edit";
  const initial = useMemo(() => (isEdit ? { ...editing!.item } : empty()), [editing, isEdit]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setForm(initial), [editing]);

  const setField = <K extends keyof Review>(k: K, v: Review[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && editing) {
        await apiUpdateReview(editing.item.id, form);
        toast("Témoignage mis à jour.", "check");
      } else {
        await apiCreateReview(form);
        toast("Témoignage créé.", "check");
      }
      onSaved();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Échec", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={isEdit ? "Modifier le témoignage" : "Nouveau témoignage"}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nom du client">
          <input
            type="text"
            value={form.name ?? ""}
            onChange={(e) => setField("name", e.target.value)}
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rôle">
            <input
              type="text"
              value={form.role ?? ""}
              onChange={(e) => setField("role", e.target.value)}
              placeholder="ex: CEO"
              className="w-full input-style rounded-lg px-4 py-2 text-sm"
            />
          </Field>
          <Field label="Entreprise">
            <input
              type="text"
              value={form.company ?? ""}
              onChange={(e) => setField("company", e.target.value)}
              placeholder="ex: Acme"
              className="w-full input-style rounded-lg px-4 py-2 text-sm"
            />
          </Field>
        </div>
        <Field label="URL de l'avatar (optionnel)">
          <input
            type="url"
            value={form.avatar ?? ""}
            onChange={(e) => setField("avatar", e.target.value)}
            placeholder="https://..."
            className="w-full input-style rounded-lg px-4 py-2 text-sm"
          />
        </Field>
        <Field label="Note">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setField("rating", n)}
                aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-7 h-7 ${
                    n <= (form.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-white/15"
                  }`}
                />
              </button>
            ))}
          </div>
        </Field>
        <Field label="Témoignage">
          <textarea
            rows={4}
            value={form.content ?? ""}
            onChange={(e) => setField("content", e.target.value)}
            className="w-full input-style rounded-lg px-4 py-2 text-sm resize-none"
            required
          />
        </Field>
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

