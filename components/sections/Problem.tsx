import { BarChart2, ImageOff, TrendingDown } from "lucide-react";

const items = [
  {
    Icon: TrendingDown,
    title: "Le CPA en hausse constante",
    body:
      "Votre coût d'acquisition augmente de semaine en semaine. Ce qui était rentable hier génère des pertes aujourd'hui en raison de la hausse des CPM."
  },
  {
    Icon: BarChart2,
    title: "Ventes Imprévisibles",
    body:
      "Un jour l'algorithme génère 10 ventes, le lendemain zéro. Votre activité manque de prévisibilité lorsque l'audience n'est pas correctement maîtrisée."
  },
  {
    Icon: ImageOff,
    title: "Fatigue Créative",
    body:
      "Vos visuels s'épuisent en 48 heures. Vous investissez du temps à recréer du contenu sans identifier ce qui capte réellement l'attention de votre audience."
  }
];

export default function Problem() {
  return (
    <section id="problem" className="py-32 relative bg-dark overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-danger/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="text-xs font-bold tracking-[0.2em] text-danger mb-4 uppercase">Le Constat</div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            Pourquoi vos campagnes <br />
            <span className="text-danger-gradient italic">ne performent plus en 2026.</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            L&apos;époque où il suffisait de cliquer sur &quot;Booster&quot; ou de cibler des intérêts basiques est
            révolue. Voici la réalité de la majorité des comptes que j&apos;audite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ Icon, title, body }) => (
            <div key={title} className="glass-card glass-card-danger p-8 group">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-6 text-danger border border-danger/20">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">{title}</h3>
              <p className="text-sm text-text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
