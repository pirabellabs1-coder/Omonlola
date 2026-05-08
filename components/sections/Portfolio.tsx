"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Mic,
  Rocket,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
  type LucideIcon
} from "lucide-react";

const INITIAL_VISIBLE = 4;
const STEP = 4;
import type { CaseItem, CaseSector } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  "shopping-bag": ShoppingBag,
  users: Users,
  mic: Mic,
  "book-open": BookOpen,
  rocket: Rocket,
  "trending-up": TrendingUp
};

type Filter = "Tous" | CaseSector;
const FILTERS: Filter[] = ["Tous", "E-commerce", "SaaS & B2B", "Info-produit", "Coaching"];

export default function Portfolio({ items }: { items: CaseItem[] }) {
  const [active, setActive] = useState<Filter>("Tous");
  const [openCase, setOpenCase] = useState<CaseItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [active]);

  const filtered = useMemo(
    () => (active === "Tous" ? items : items.filter((c) => c.sector === active)),
    [active, items]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remaining = filtered.length - visibleCount;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (openCase) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [openCase]);

  if (items.length === 0) return null;

  return (
    <>
      <section id="work" className="py-32 relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand/8 blur-[180px] rounded-full pointer-events-none z-0" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Études de cas</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">
              Ce que les chiffres <span className="text-brand-gradient italic">disent.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`px-5 py-2 rounded-full text-sm font-bold hoverable transition-all ${
                    active === f
                      ? "bg-brand text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                      : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {visible.map((c, i) => (
              <CaseCard key={c.id} item={c} index={i} onOpen={() => setOpenCase(c)} />
            ))}
            {visible.length === 0 && (
              <div className="md:col-span-2 text-center text-text-muted text-sm py-16">
                Aucune étude de cas dans cette catégorie.
              </div>
            )}
          </div>

          {hasMore && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <button
                onClick={() => setVisibleCount((n) => n + STEP)}
                className="magnetic-btn px-7 py-3.5 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm flex items-center gap-2 hover:bg-brand hover:border-brand transition-all hoverable"
              >
                Voir plus d&apos;études{" "}
                <span className="bg-white/10 group-hover:bg-white/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  +{Math.min(STEP, remaining)}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-[10px] uppercase tracking-widest text-text-muted">
                {visibleCount} / {filtered.length} affichées
              </span>
            </div>
          )}
        </div>
      </section>

      <CaseModal item={openCase} onClose={() => setOpenCase(null)} />
    </>
  );
}

function CaseCard({
  item,
  index,
  onOpen
}: {
  item: CaseItem;
  index: number;
  onOpen: () => void;
}) {
  const Icon = ICONS[item.icon] ?? ShoppingBag;
  return (
    <article
      onClick={onOpen}
      className="group glass-card !rounded-3xl overflow-hidden cursor-pointer hoverable flex flex-col"
    >
      <div className="relative h-64 md:h-72 overflow-hidden bg-dark">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/20 via-dark to-dark">
            <Icon className="w-16 h-16 text-brand/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="bg-black/60 backdrop-blur text-[10px] font-bold px-3 py-1.5 rounded-full text-white flex items-center gap-1.5 border border-white/10">
            <Icon className="w-3 h-3" /> {item.sector}
          </div>
          <div className="text-[10px] font-mono text-white/40 tracking-widest">
            CASE • {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Bottom title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {item.client && (
            <div className="text-[10px] tracking-widest font-bold text-brand uppercase mb-1">
              {item.client}
            </div>
          )}
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {item.description && (
          <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>
        )}

        {item.kpis.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 border-y border-white/5 py-5">
            {item.kpis.slice(0, 3).map((k, i) => (
              <div key={k.name + i} className={i > 0 ? "border-l border-white/5 pl-3" : ""}>
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-1">
                  {k.name}
                </div>
                <div className="font-display font-bold text-2xl text-brand-gradient">{k.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-text-muted">
            {new Date(item.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand group-hover:gap-3 transition-all">
            Lire l&apos;étude <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

function CaseModal({ item, onClose }: { item: CaseItem | null; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;
  const Icon = ICONS[item.icon] ?? ShoppingBag;

  // Split body into paragraphs and detect short headings (single-line, < 40 chars, no period)
  const paragraphs = (item.body || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start md:items-center justify-center p-0 md:p-8">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-dark border border-white/10 md:rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden my-0 md:my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero */}
          <div className="relative h-72 md:h-96 bg-dark">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/30 via-dark to-dark">
                <Icon className="w-20 h-20 text-brand/60" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand/20 backdrop-blur border border-brand/30 text-[10px] font-bold px-3 py-1.5 rounded-full text-brand flex items-center gap-1.5">
                  <Icon className="w-3 h-3" /> {item.sector}
                </div>
                {item.client && (
                  <div className="text-[10px] tracking-widest font-bold text-white/70 uppercase">
                    {item.client}
                  </div>
                )}
              </div>
              <h2 className="font-display font-bold text-2xl md:text-4xl text-white leading-tight max-w-3xl">
                {item.title}
              </h2>
            </div>
          </div>

          {/* KPIs strip */}
          {item.kpis.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border-b border-white/5">
              {item.kpis.slice(0, 4).map((k, i) => (
                <div key={k.name + i} className="bg-dark px-6 py-5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-1.5">
                    {k.name}
                  </div>
                  <div className="font-display font-bold text-3xl text-brand-gradient">{k.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="p-6 md:p-10 max-w-3xl mx-auto">
            {item.description && (
              <p className="text-lg text-white/90 leading-relaxed mb-8 italic border-l-2 border-brand pl-4">
                {item.description}
              </p>
            )}

            {paragraphs.length === 0 ? (
              <p className="text-text-muted text-sm">Étude de cas détaillée à venir.</p>
            ) : (
              <div className="space-y-6">
                {paragraphs.map((p, i) => {
                  const isHeading = p.length < 40 && !/[.!?]$/.test(p) && !p.includes("\n");
                  if (isHeading) {
                    return (
                      <h3
                        key={i}
                        className="font-display font-bold text-xl md:text-2xl text-brand mt-8 first:mt-0"
                      >
                        {p}
                      </h3>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className="text-white/85 leading-relaxed whitespace-pre-wrap"
                    >
                      {p}
                    </p>
                  );
                })}
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-text-muted text-sm">Vous voulez le même type de résultats ?</p>
              <a
                href="#contact"
                onClick={onClose}
                className="magnetic-btn px-6 py-3 rounded-xl bg-brand text-white text-sm font-bold flex items-center gap-2 hover:bg-brand-light transition-colors shadow-[0_0_20px_rgba(0,102,255,0.4)]"
              >
                Discuter de votre projet <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
