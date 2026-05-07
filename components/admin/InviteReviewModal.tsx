"use client";

import { Check, Copy, Loader2, Mail, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useToast } from "@/components/Toast";
import { apiCreateReviewRequest } from "./api";

export default function InviteReviewModal({
  open,
  onClose,
  onCreated
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (open) {
      setClientName("");
      setClientEmail("");
      setNote("");
      setGeneratedUrl(null);
      setCopied(false);
    }
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim()) return;
    setCreating(true);
    try {
      const res = await apiCreateReviewRequest({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        note: note.trim()
      });
      setGeneratedUrl(res.url);
      onCreated();
      toast("Lien d'invitation créé.", "check");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Échec", "error");
    } finally {
      setCreating(false);
    }
  }

  async function copyLink() {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Impossible de copier — sélectionnez le lien manuellement.", "error");
    }
  }

  const waText = encodeURIComponent(
    `Bonjour ${clientName || ""}, voici un lien pour laisser un témoignage : ${generatedUrl ?? ""}`
  );
  const mailtoSubject = encodeURIComponent("Votre avis sur notre collaboration");
  const mailtoBody = encodeURIComponent(
    `Bonjour ${clientName || ""},\n\nVotre retour compte. Voici un lien personnel pour laisser un témoignage en quelques secondes :\n${generatedUrl ?? ""}\n\nMerci !`
  );

  return (
    <Modal open={open} onClose={onClose} title="Inviter un client à laisser un témoignage">
      {!generatedUrl ? (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-text-muted">
            Saisissez le nom de votre client. Un lien personnel et sécurisé sera généré que vous pourrez lui envoyer
            par WhatsApp ou email.
          </p>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Nom du client *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="ex: Sophie Dubois"
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
              Email (optionnel — pour pré-remplir le bouton mailto)
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@exemple.com"
              className="w-full input-style rounded-lg px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
              Mot personnel (optionnel — affiché sur la page)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bonjour Sophie, suite à notre collaboration sur la campagne Q4…"
              className="w-full input-style rounded-lg px-4 py-3 text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !clientName.trim()}
            className="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brand-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Création…
              </>
            ) : (
              <>
                Générer le lien <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1">Lien prêt à être envoyé</h3>
            <p className="text-text-muted text-sm">Pour <span className="text-white">{clientName}</span></p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Lien sécurisé</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedUrl}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 input-style rounded-lg px-4 py-3 text-sm font-mono text-xs"
              />
              <button
                type="button"
                onClick={copyLink}
                className="px-4 py-3 rounded-lg bg-brand text-white font-semibold text-sm flex items-center gap-2 hover:bg-brand-light transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copier
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-text-muted uppercase mb-2">Envoyer le lien</div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-500/10 hover:border-green-500/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-400" /> WhatsApp
              </a>
              <a
                href={`mailto:${clientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`}
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand/10 hover:border-brand/30 transition-colors"
              >
                <Mail className="w-4 h-4 text-brand" /> Email
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-text-muted hover:text-white py-2 text-sm"
          >
            Fermer
          </button>
        </div>
      )}
    </Modal>
  );
}
