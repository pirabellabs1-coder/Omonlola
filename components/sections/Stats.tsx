import { BarChart3, Briefcase, Calendar, Users } from "lucide-react";

const STATS = [
  {
    icon: BarChart3,
    value: "12 M€+",
    label: "Budget publicitaire géré",
    sub: "Sur Meta Ads, TikTok Ads et Google Ads cumulés."
  },
  {
    icon: Users,
    value: "200+",
    label: "Comptes audités",
    sub: "E-commerce, SaaS et lead gen, du seed à 8 chiffres."
  },
  {
    icon: BarChart3,
    value: "x4.5",
    label: "ROAS moyen post-optim",
    sub: "Sur les 90 premiers jours d'accompagnement."
  },
  {
    icon: Calendar,
    value: "7 ans",
    label: "Sur le terrain Meta Ads",
    sub: "Depuis l'iOS 14, Advantage+, l'arrivée de l'IA. Tout encaissé."
  }
];

export default function Stats() {
  return (
    <section className="py-24 relative bg-[#050505] border-t border-white/5 overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">
            Chiffres clés
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            7 ans de terrain. <span className="text-brand-gradient italic">Mesurable.</span>
          </h2>
          <p className="text-text-muted text-base">
            Pas de promesses creuses. Voici la trace concrète de ce que j&apos;ai géré pour mes clients.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map(({ icon: Icon, value, label, sub }) => (
            <div
              key={label}
              className="group glass-card p-6 md:p-7 flex flex-col gap-3 hover:!border-brand/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div className="font-display font-black text-3xl md:text-5xl text-white leading-none">
                {value}
              </div>
              <div className="font-bold text-sm text-white">{label}</div>
              <div className="text-xs text-text-muted leading-relaxed">{sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs uppercase tracking-widest text-text-muted">
          <span className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-brand" /> Meta Business Partner
          </span>
          <span className="hidden md:inline text-white/10">·</span>
          <span>Meta Blueprint Certified</span>
          <span className="hidden md:inline text-white/10">·</span>
          <span>TikTok Ads Manager Certified</span>
          <span className="hidden md:inline text-white/10">·</span>
          <span>Google Ads Certified</span>
        </div>
      </div>
    </section>
  );
}
