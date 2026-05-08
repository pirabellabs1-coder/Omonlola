const rows = [
  { label: "Gestion du compte", me: "Géré par moi-même", them: "Souvent délégué à des profils juniors" },
  { label: "Focus stratégique", me: "ROI & Ventes nettes", them: '"Likes", "Reach" et "Vues"' },
  { label: "Communication", me: "Accès direct sur WhatsApp", them: "Tickets lents & Account Managers" },
  {
    label: "Coûts cachés",
    me: "Zéro. Tout est clair.",
    them: "Frais d'onboarding exorbitants",
    accent: true
  }
];

export default function Compare() {
  return (
    <section className="py-32 relative border-t border-white/5 bg-[#020202]">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Le Choix</div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            Spécialiste Indépendant <br />
            <span className="text-brand-gradient italic">vs Agence Traditionnelle.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto glass-card overflow-hidden">
          <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
            <div className="p-6 font-bold text-white" />
            <div className="p-6 font-display font-bold text-brand text-center border-l border-white/10">
              Omonlola
            </div>
            <div className="p-6 font-display font-bold text-text-muted text-center border-l border-white/10">
              Grosses Agences
            </div>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`grid grid-cols-3 ${
                i < rows.length - 1 ? "border-b border-white/5" : ""
              } hover:bg-white/[0.02] transition-colors`}
            >
              <div className="p-4 md:p-6 text-sm font-semibold text-white">{r.label}</div>
              <div
                className={`p-4 md:p-6 text-sm text-center border-l border-white/10 ${
                  r.accent ? "text-brand font-bold" : "text-white"
                }`}
              >
                {r.me}
              </div>
              <div className="p-4 md:p-6 text-sm text-center text-text-muted border-l border-white/10">{r.them}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
