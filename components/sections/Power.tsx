import { Database, Focus } from "lucide-react";

export default function Power() {
  return (
    <section className="py-32 relative bg-dark border-t border-white/5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">La Solution</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Meta n&apos;est pas mort. <br />
            <span className="text-brand-gradient italic">Il a juste besoin d&apos;une stratégie adaptée.</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            L&apos;algorithme de Meta reste l&apos;outil le plus puissant du marché, à condition de savoir comment
            l&apos;alimenter correctement en 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            Icon={Database}
            title="Le pouvoir de la Data Pure"
            body="Fini le ciblage approximatif. Je connecte directement votre backend (Shopify, CRM) à l'API de Conversions de Meta (CAPI). L'algorithme apprend de vos vrais acheteurs en temps réel."
            tags={["CAPI Server-side", "Advanced Matching"]}
          />
          <Card
            Icon={Focus}
            title="La Créa est votre nouveau ciblage"
            body="On ne cible plus avec des boutons, on cible avec le message. Une vidéo bien scriptée attire exactement la personne prête à acheter, même en audience complètement large (Broad)."
            tags={["Broad Targeting", "Hook Psychology"]}
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  Icon,
  title,
  body,
  tags
}: {
  Icon: typeof Database;
  title: string;
  body: string;
  tags: string[];
}) {
  return (
    <div className="glass-card p-10 relative overflow-hidden group">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand/20 blur-3xl group-hover:bg-brand/40 transition-colors" />
      <Icon className="w-10 h-10 text-brand mb-6" />
      <h3 className="font-display font-bold text-3xl mb-4 text-white">{title}</h3>
      <p className="text-text-muted mb-6">{body}</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((t) => (
          <span key={t} className="text-[10px] font-bold tracking-wider uppercase bg-white/10 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
