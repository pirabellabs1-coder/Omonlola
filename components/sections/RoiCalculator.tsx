"use client";

import { useMemo, useState } from "react";

const formatMoney = (n: number) => n.toLocaleString("fr-FR") + " €";
const ROAS = 3.5;

export default function RoiCalculator() {
  const [budget, setBudget] = useState(5000);

  const { revenue, profit } = useMemo(() => {
    const revenue = budget * ROAS;
    return { revenue, profit: revenue - budget };
  }, [budget]);

  return (
    <section id="calculator" className="py-24 relative border-y border-white/5 bg-dark overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Simulateur</div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Simulez votre <span className="text-brand-gradient">potentiel.</span>
          </h2>
          <p className="text-text-muted text-sm mb-8">
            Déplacez le curseur pour découvrir ce qu&apos;un accompagnement professionnel avec un ROAS cible de 3.5x
            peut générer pour votre entreprise.
          </p>

          <div className="mb-6">
            <div className="flex justify-between text-sm font-bold text-white mb-4">
              <span>Budget Publicitaire Mensuel</span>
              <span className="text-brand font-display text-xl">{formatMoney(budget)}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value, 10))}
              className="hoverable"
            />
            <div className="flex justify-between text-[10px] text-text-muted font-bold mt-2 uppercase">
              <span>1 000 €</span>
              <span>50 000 € +</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 w-full">
          <div className="glass-card p-8 !border-brand/30 shadow-[0_0_40px_rgba(0,102,255,0.1)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-brand" />
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 text-center">
              Revenus Estimés (ROAS 3.5x)
            </h3>
            <div className="text-center">
              <div className="font-display font-black text-5xl md:text-7xl text-white mb-2">
                {formatMoney(revenue)}
              </div>
              <div className="text-green-400 text-sm font-bold bg-green-500/10 inline-block px-3 py-1 rounded-full border border-green-500/20">
                Profit brut: {formatMoney(profit)}
              </div>
            </div>
            <div className="mt-8 text-center">
              <a
                href="#contact"
                className="magnetic-btn px-6 py-3 rounded-lg bg-brand text-white text-sm font-bold w-full hover:bg-brand-light transition-colors hoverable inline-block"
              >
                Obtenir ces résultats
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
