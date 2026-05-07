import { Check } from "lucide-react";
import type { PricingPlan } from "@/lib/types";

export default function Pricing({ items }: { items: PricingPlan[] }) {
  if (items.length === 0) return null;

  return (
    <section id="pricing" className="py-24 relative bg-dark border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">
            Investissez dans du trafic <span className="text-brand-gradient italic">qui convertit.</span>
          </h2>
          <p className="text-text-muted text-sm">Des offres claires pour chaque besoin. Sans engagement de durée.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((p) => (
            <div
              key={p.id}
              className={`glass-card p-8 flex flex-col hoverable relative ${
                p.popular
                  ? "!border-brand/50 bg-[rgba(0,102,255,0.02)] transform md:-translate-y-4 shadow-[0_0_40px_rgba(0,102,255,0.1)]"
                  : ""
              }`}
            >
              {p.popular && (
                <>
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-brand" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Populaire
                  </div>
                </>
              )}
              <h3 className={`font-bold text-xl mb-2 uppercase tracking-wide ${p.popular ? "text-brand" : ""}`}>
                {p.name}
              </h3>
              {p.description && <p className="text-sm text-text-muted mb-6">{p.description}</p>}
              <div className="text-3xl font-display font-bold text-white mb-8">
                {p.price}{" "}
                {p.unit && <span className="text-sm text-text-muted font-sans font-normal">{p.unit}</span>}
              </div>
              {p.features.length > 0 && (
                <ul className="space-y-4 mb-8 flex-1">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={p.ctaLink || "#contact"}
                className={`w-full py-3 rounded-lg font-bold transition-colors text-center inline-block ${
                  p.popular
                    ? "bg-brand text-white hover:bg-brand-light shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                {p.cta || "Demander un devis"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
