"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useToast } from "../Toast";
import { trackEvent } from "@/lib/track";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    trackEvent("lead_magnet_submit_attempt");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { fileUrl?: string };
      trackEvent("lead_magnet_submit_success");
      if (data.fileUrl) {
        const a = document.createElement("a");
        a.href = data.fileUrl;
        a.download = "5-erreurs-meta-ads.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      toast("Téléchargement du PDF en cours…", "check");
      setEmail("");
    } catch {
      trackEvent("lead_magnet_submit_error");
      toast("Une erreur est survenue, réessayez.", "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="py-24 relative border-t border-white/5 bg-[#050505] overflow-hidden">
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-brand/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 w-full flex justify-center gsap-reveal">
          <div className="relative w-64 h-80 bg-dark border border-white/20 rounded-r-2xl rounded-l-md shadow-[-20px_20px_40px_rgba(0,0,0,0.8)] transform -rotate-12 animate-float flex flex-col justify-between p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
            <div className="relative z-10 ml-4">
              <AlertTriangle className="text-brand w-8 h-8 mb-4" />
              <h3 className="font-display font-bold text-2xl text-white mb-2 leading-tight">
                Les 5 erreurs qui pénalisent vos campagnes Meta Ads.
              </h3>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 text-center lg:text-left gsap-reveal">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Ressource Gratuite</div>
          <h2 className="font-display font-bold text-4xl mb-4">Téléchargez notre guide stratégique.</h2>
          <p className="text-text-muted text-lg mb-8 max-w-md mx-auto lg:mx-0">
            Un PDF de 12 pages décortiquant les erreurs qui coûtent le plus cher aux annonceurs cette année.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand"
              required
            />
            <button
              type="submit"
              disabled={pending}
              className="magnetic-btn px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors shrink-0 disabled:opacity-60"
            >
              {pending ? "Envoi…" : "Recevoir le PDF"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
