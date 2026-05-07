"use client";

import { CheckCircle2, Loader2, Send, Star } from "lucide-react";
import { useState } from "react";

export default function ReviewForm({ token, clientName }: { token: string; clientName: string }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!content.trim()) {
      setError("Merci d'écrire quelques mots.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch(`/api/reviews/by-token/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, content, role, company })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Échec");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">Merci, {clientName} !</h2>
        <p className="text-text-muted">Votre témoignage a bien été reçu.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Votre note
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              className="hoverable"
              aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
            >
              <Star
                className={`w-9 h-9 transition-colors ${
                  n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-white/15"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
          Votre témoignage
        </label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comment décririez-vous votre expérience ?"
          className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Rôle (optionnel)
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="ex: CEO"
            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Entreprise (optionnel)
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="ex: Acme"
            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 rounded-xl bg-brand text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-light transition-colors disabled:opacity-60 shadow-[0_0_20px_rgba(0,102,255,0.3)]"
      >
        {pending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Envoi…
          </>
        ) : (
          <>
            Envoyer mon témoignage <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-text-muted text-[10px] text-center">
        En soumettant ce formulaire, vous acceptez que votre témoignage soit affiché publiquement sur le site.
      </p>
    </form>
  );
}
