import { PenTool, Search, Target, type LucideIcon } from "lucide-react";

const services: { Icon: LucideIcon; title: string; body: string; bullets: string[]; primary?: boolean }[] = [
  {
    Icon: Target,
    title: "Gestion Meta Ads",
    body:
      "Setup, test créatif, scaling horizontal et vertical. Je maintiens le CPA au plus bas pour maximiser votre marge.",
    bullets: ["Tracking Avancé (CAPI)", "AB Testing continu"],
    primary: true
  },
  {
    Icon: Search,
    title: "Audit de Compte",
    body:
      "Analyse de votre compte publicitaire existant pour identifier les fuites de budget et les opportunités de croissance.",
    bullets: ["Diagnostic Funnel", "Plan d'action stratégique"]
  },
  {
    Icon: PenTool,
    title: "Stratégie Créative",
    body: "Briefs créatifs et scripts pour produire des vidéos UGC ou Motion qui convertissent massivement.",
    bullets: ["Hooks psychologiques", "Scripts VSL"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Expertise</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Ce que je fais <span className="text-brand-gradient italic">pour vous.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(({ Icon, title, body, bullets, primary }) => (
            <div key={title} className="glass-card p-8 hoverable group">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                  primary
                    ? "bg-brand/10 text-brand border border-brand/20"
                    : "bg-white/5 text-white border border-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">{title}</h3>
              <p className="text-sm text-text-muted mb-6">{body}</p>
              <ul className="space-y-2">
                {bullets.map((b) => (
                  <li key={b} className="text-xs text-gray-400 flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${primary ? "bg-brand" : "bg-white"}`} /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
