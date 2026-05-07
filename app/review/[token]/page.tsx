import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { listAll } from "@/lib/store";
import { STORE, type ReviewRequest } from "@/lib/types";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Laisser un témoignage | Omonlola AI",
  robots: { index: false, follow: false }
};

async function getRequest(token: string): Promise<ReviewRequest | null> {
  const all = await listAll<ReviewRequest>(STORE.reviewRequests);
  return all.find((r) => r.token === token) ?? null;
}

export default async function ReviewPage({ params }: { params: { token: string } }) {
  const req = await getRequest(params.token);

  return (
    <div className="min-h-screen bg-dark text-white relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand/10 blur-[150px] rounded-full pointer-events-none" />

      <header className="relative z-10 px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="font-display font-bold text-lg flex items-center gap-2">
          <span className="text-white">Omonlola</span>
          <span className="text-brand">AI</span>
        </Link>
        <div className="text-xs text-text-muted flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" /> Lien sécurisé
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {!req ? (
            <Invalid />
          ) : req.submittedAt ? (
            <AlreadySubmitted />
          ) : (
            <div className="glass-card p-8 md:p-10 !border-brand/20 shadow-[0_0_50px_rgba(0,102,255,0.08)]">
              <div className="text-xs font-bold tracking-[0.2em] text-brand mb-3 uppercase">
                Demande de témoignage
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3 leading-tight">
                Bonjour <span className="text-brand-gradient">{req.clientName}</span>,
              </h1>
              <p className="text-text-muted mb-8 leading-relaxed">
                Votre retour compte beaucoup. Quelques mots suffisent — il sera publié sur la page d&apos;accueil
                après une rapide validation.
              </p>
              {req.note && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 text-sm text-white/80">
                  <span className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1 block">
                    Mot d&apos;Omonlola
                  </span>
                  {req.note}
                </div>
              )}
              <ReviewForm token={req.token} clientName={req.clientName} />
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 px-6 py-4 border-t border-white/5 text-center text-[10px] uppercase tracking-widest text-text-muted">
        © {new Date().getFullYear()} Omonlola AI
      </footer>
    </div>
  );
}

function Invalid() {
  return (
    <div className="glass-card p-10 text-center !border-red-500/20">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
        <ShieldCheck className="w-5 h-5 text-red-400" />
      </div>
      <h1 className="font-display font-bold text-2xl mb-2">Lien invalide ou expiré</h1>
      <p className="text-text-muted text-sm mb-6">
        Ce lien d&apos;invitation n&apos;existe plus. Contactez-nous pour en obtenir un nouveau.
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 rounded-lg bg-brand text-white font-bold hover:bg-brand-light transition-colors"
      >
        Retour au site
      </Link>
    </div>
  );
}

function AlreadySubmitted() {
  return (
    <div className="glass-card p-10 text-center !border-green-500/20">
      <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-7 h-7 text-green-400" />
      </div>
      <h1 className="font-display font-bold text-2xl mb-2">Merci pour votre témoignage !</h1>
      <p className="text-text-muted text-sm mb-6">
        Votre avis a déjà été enregistré. Il apparaîtra sur la page d&apos;accueil après validation.
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 rounded-lg bg-brand text-white font-bold hover:bg-brand-light transition-colors"
      >
        Visiter le site
      </Link>
    </div>
  );
}
