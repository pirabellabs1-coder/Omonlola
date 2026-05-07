import { Mic, ShoppingBag, Users, type LucideIcon } from "lucide-react";

const sectors: { Icon: LucideIcon; img: string; title: string; body: string }[] = [
  {
    Icon: ShoppingBag,
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800",
    title: "E-commerce",
    body: "Optimisation du tunnel de vente, retargeting dynamique, scaling des budgets sans perte de ROAS."
  },
  {
    Icon: Users,
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800",
    title: "SaaS & B2B",
    body: "Génération de leads qualifiés, baisse du CPL, optimisation pour la prise de rendez-vous (démo)."
  },
  {
    Icon: Mic,
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
    title: "Info-produit",
    body: "Acquisition pour webinaires, lancements de formation, stratégies de VSL."
  }
];

export default function Sectors() {
  return (
    <section className="py-32 relative border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Mes Niches</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Les secteurs où <span className="text-brand-gradient italic">j&apos;optimise les coûts.</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[500px]">
          {sectors.map(({ Icon, img, title, body }) => (
            <div key={title} className="expand-card glass-card relative rounded-2xl group border border-white/10 min-h-[300px]">
              <img
                src={img}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:opacity-40 transition-opacity rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent rounded-2xl" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center mb-4 backdrop-blur">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="font-display font-bold text-3xl text-white mb-2">{title}</h3>
                <div className="content-reveal md:absolute md:opacity-0 md:translate-y-5 transition-all">
                  <p className="text-sm text-gray-300 mt-2">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
