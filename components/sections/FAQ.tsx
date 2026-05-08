"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { FaqItem } from "@/lib/types";

const INITIAL_FAQ = 6;

export default function FAQ({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);
  const [showAll, setShowAll] = useState(false);

  if (items.length === 0) return null;

  const visibleItems = showAll ? items : items.slice(0, INITIAL_FAQ);
  const hasMore = items.length > INITIAL_FAQ && !showAll;

  return (
    <section id="faq" className="py-32 relative border-t border-white/5 bg-dark overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" /> FAQ
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            Questions <span className="text-brand-gradient italic">fréquentes.</span>
          </h2>
          <p className="text-text-muted text-lg">Tout ce que vous devez savoir avant de démarrer.</p>
        </div>

        <div className="space-y-3">
          {visibleItems.map((it) => {
            const isOpen = openId === it.id;
            return (
              <div key={it.id} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : it.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hoverable"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-white">{it.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-text-muted text-sm whitespace-pre-wrap">{it.answer}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="magnetic-btn px-7 py-3 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm flex items-center gap-2 hover:bg-brand hover:border-brand transition-all hoverable"
            >
              Voir toutes les questions
              <span className="bg-white/10 text-[10px] font-mono px-2 py-0.5 rounded-full">
                +{items.length - INITIAL_FAQ}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
