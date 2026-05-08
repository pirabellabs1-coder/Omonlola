import { GraduationCap, Layers, ShoppingBag, Sparkles } from "lucide-react";

const VERTICALS = [
  {
    icon: ShoppingBag,
    name: "E-commerce / DTC",
    desc: "Marques produits qui veulent scaler leur acquisition Meta sans casser leur ROAS. Spécialisé Shopify, WooCommerce, Magento.",
    bullets: ["Catalogues > 50 SKU", "Tracking CAPI + Triple Whale", "Scaling vertical contrôlé"]
  },
  {
    icon: Layers,
    name: "SaaS / Tech",
    desc: "Apps B2C, B2B SaaS et plateformes qui pilotent leur croissance par la qualité du lead, pas le volume brut.",
    bullets: ["LTV/CAC > 3", "Free trial / Demo book", "Optimisation post-signup"]
  },
  {
    icon: Sparkles,
    name: "Lead Gen B2B",
    desc: "Générer des leads qualifiés au bon coût pour les équipes commerciales. Spécialisé services, conseil, immobilier.",
    bullets: ["Formulaires Meta natifs", "Scoring & qualification", "Intégration CRM (HubSpot/Pipedrive)"]
  },
  {
    icon: GraduationCap,
    name: "Coaching & Infoproduits",
    desc: "Webinaires, formations, masterclass. Construire un funnel acquisition qui transforme des froids en acheteurs récurrents.",
    bullets: ["VSL & funnel d'inscription", "Retargeting multi-niveaux", "LTV par cohorte"]
  }
];

export default function Industries() {
  return (
    <section className="py-24 relative bg-dark border-t border-white/5 overflow-hidden">
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-brand/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">
            Secteurs d&apos;intervention
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Les business avec qui je <span className="text-brand-gradient italic">performe le mieux.</span>
          </h2>
          <p className="text-text-muted text-base">
            Je n&apos;accompagne pas tout le monde. Voici les 4 verticaux où ma méthode produit
            les résultats les plus prévisibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VERTICALS.map(({ icon: Icon, name, desc, bullets }) => (
            <div
              key={name}
              className="group glass-card p-7 md:p-8 flex flex-col gap-5 hover:!border-brand/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">{name}</h3>
              </div>

              <p className="text-text-muted text-sm leading-relaxed">{desc}</p>

              <ul className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-white/5">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="text-[11px] uppercase tracking-wider font-bold text-white/70 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted">
            Vous n&apos;êtes dans aucun de ces verticaux ?{" "}
            <a href="#contact" className="text-brand hover:underline font-bold">
              Parlons-en quand même
            </a>{" "}
            — j&apos;orienterai vers un confrère si ce n&apos;est pas mon terrain.
          </p>
        </div>
      </div>
    </section>
  );
}
