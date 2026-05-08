"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useToast } from "../Toast";
import { trackEvent } from "@/lib/track";

export default function Contact({ whatsapp }: { whatsapp?: string }) {
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    budget: "< 1500€ (Audit recommandé)",
    message: ""
  });
  const toast = useToast();

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    trackEvent("contact_submit_attempt");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("failed");
      trackEvent("contact_submit_success");
      toast("Demande envoyée avec succès ! Nous vous recontactons sous 24h.", "send");
      setForm({
        name: "",
        email: "",
        budget: "< 1500€ (Audit recommandé)",
        message: ""
      });
    } catch {
      trackEvent("contact_submit_error");
      toast("Une erreur est survenue, réessayez.", "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-dark border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-6 leading-tight">
            Prêt à optimiser votre <span className="text-brand-gradient">ROAS ?</span>
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-lg mx-auto lg:mx-0">
            Décrivez-moi vos objectifs. Je vous répondrai avec un avis professionnel et un plan d&apos;action
            personnalisé.
          </p>
          {whatsapp && (
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
                className="magnetic-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-brand hover:border-brand transition-all"
              >
                <MessageCircle className="w-5 h-5 text-green-400" /> Échanger via WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 w-full max-w-md mx-auto lg:mx-0">
          <form
            onSubmit={onSubmit}
            className="glass-card p-8 flex flex-col gap-5 !border-brand/20 shadow-[0_0_30px_rgba(0,102,255,0.05)]"
          >
            <h3 className="font-bold text-2xl mb-2 text-white">Décrivez-nous votre projet</h3>
            <Field label="Nom complet">
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
                required
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                placeholder="john@exemple.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
                required
              />
            </Field>
            <Field label="Budget pub / mois">
              <select
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand cursor-pointer"
              >
                <option>&lt; 1500€ (Audit recommandé)</option>
                <option>1500€ - 5000€</option>
                <option>&gt; 5000€</option>
              </select>
            </Field>
            <Field label="Vos objectifs">
              <textarea
                rows={3}
                placeholder="Quels sont vos défis actuels sur Meta Ads ?"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand resize-none"
                required
              />
            </Field>
            <button
              type="submit"
              disabled={pending}
              className="w-full py-4 mt-2 rounded-xl bg-brand text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-light transition-colors disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer la demande <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
