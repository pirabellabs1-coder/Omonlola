import { Check, CheckCircle2, X, XCircle } from "lucide-react";

const good = [
  {
    title: "Preuve de concept validée",
    body: "Vous avez déjà réalisé des ventes, votre produit a trouvé son marché et votre offre est claire."
  },
  {
    title: "Budget Ads > 1 500€ / mois",
    body: "Vous disposez de la capacité d'investissement nécessaire pour que l'algorithme apprenne efficacement."
  }
];

const bad = [
  {
    title: 'Business Dropshipping "One-shot"',
    body: "L'activité repose sur des produits éphémères sans stratégie à long terme."
  },
  {
    title: "Attentes irréalistes",
    body: "Un investissement minimal est engagé avec l'attente de résultats significatifs dès les premières heures."
  }
];

export default function Qualification() {
  return (
    <section className="py-32 relative border-t border-white/5 bg-[#020202]">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Qualification</div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            À qui s&apos;adresse <br />
            <span className="text-brand-gradient italic">mon accompagnement ?</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Pour garantir des résultats optimaux, votre entreprise doit disposer de fondations solides. Voici les
            critères d&apos;éligibilité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 md:p-12 !border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                <Check className="text-green-400 w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white">Je peux vous accompagner si :</h3>
            </div>
            <ul className="space-y-6">
              {good.map((g) => (
                <li key={g.title} className="flex items-start gap-4">
                  <CheckCircle2 className="text-green-400 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">{g.title}</h4>
                    <p className="text-sm text-text-muted">{g.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 md:p-12 !border-red-500/20 bg-[rgba(255,51,102,0.02)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                <X className="text-red-400 w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white">Cet accompagnement n&apos;est pas adapté si :</h3>
            </div>
            <ul className="space-y-6">
              {bad.map((b) => (
                <li key={b.title} className="flex items-start gap-4">
                  <XCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">{b.title}</h4>
                    <p className="text-sm text-text-muted">{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
