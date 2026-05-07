const steps = [
  {
    n: "01",
    title: "Audit & Setup Data",
    body: "Audit complet du compte, du marché et des concurrents. Nous configurons le tracking (CAPI) avec précision."
  },
  {
    n: "02",
    title: "Recherche & Angles",
    body:
      "Définition des meilleurs angles marketing. Nous analysons les frustrations et motivations de votre client idéal."
  },
  {
    n: "03",
    title: "Briefs Créatifs",
    body:
      "Nous rédigeons les hooks et créons les briefs pour les visuels. La création est le levier principal de performance."
  },
  {
    n: "04",
    title: "Lancement & Phase de Test",
    body:
      "Lancement avec des campagnes de tests dynamiques (DCO). Nous isolons rapidement les combinaisons qui génèrent le meilleur CPA.",
    accent: true
  },
  {
    n: "05",
    title: "Optimisation Continue",
    body:
      "Analyse des premières métriques. Nous itérons sur les créas gagnantes et supprimons méthodiquement ce qui consomme du budget sans résultat."
  },
  {
    n: "06",
    title: "Scaling & Bilan",
    body:
      "Nous augmentons progressivement le budget (scaling vertical) ou dupliquons vers de nouveaux marchés. Un reporting clair vous est envoyé chaque semaine."
  }
];

export default function Process() {
  return (
    <section id="process" className="py-32 bg-dark relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 relative items-start">
        <div className="sticky top-32">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Méthodologie</div>
          <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">
            Le Process <br />
            <span className="text-brand">Omonlola.</span>
          </h2>
          <p className="text-text-muted text-lg">
            6 étapes précises, validées ensemble. Aucune boîte noire, aucune surprise. Vous savez exactement ce que
            nous testons et pourquoi.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`glass-card p-10 sticky-card ${
                s.accent ? "!border-brand/50 shadow-[0_-10px_30px_rgba(0,102,255,0.1)]" : ""
              }`}
              style={{ top: `${120 + i * 20}px`, zIndex: 10 + i }}
            >
              <div className={`text-5xl font-display font-bold mb-4 ${s.accent ? "text-brand/20" : "text-white/10"}`}>
                {s.n}
              </div>
              <h3 className={`font-bold text-2xl mb-3 ${s.accent ? "text-brand" : "text-white"}`}>{s.title}</h3>
              <p className="text-text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
