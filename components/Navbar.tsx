"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Calculator, Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        id="navbar"
        className="fixed top-0 w-full z-50 bg-dark/70 backdrop-blur-xl border-b border-white/5 transition-transform duration-500"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 md:h-24 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl md:text-2xl flex items-center gap-2 hoverable">
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-brand" />
            </div>
            <span className="text-white tracking-tight">Omonlola</span>
            <span className="text-brand">AI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-text-muted">
            <a href="#problem" className="hover:text-white transition-colors hoverable">L&apos;Enjeu</a>
            <a href="#services" className="hover:text-white transition-colors hoverable">Expertise</a>
            <a href="#work" className="hover:text-white transition-colors hoverable">Résultats</a>
            <a href="#faq" className="hover:text-white transition-colors hoverable">FAQ</a>
            <a href="#calculator" className="hover:text-brand transition-colors hoverable flex items-center gap-1">
              <Calculator className="w-4 h-4" /> ROI
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:flex magnetic-btn px-6 py-3 rounded-full bg-white text-black text-sm font-bold items-center gap-2 hoverable shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Démarrer un projet <ArrowRight className="w-4 h-4" />
            </a>
            <button onClick={() => setOpen(true)} className="lg:hidden text-white hoverable" aria-label="Ouvrir le menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-[#0A0A0A] border-l border-white/10 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <span className="font-display font-bold text-lg text-white">Menu</span>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white" aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 p-4">
              <MobLink onClick={() => setOpen(false)} href="#problem">L&apos;Enjeu</MobLink>
              <MobLink onClick={() => setOpen(false)} href="#services">Expertise</MobLink>
              <MobLink onClick={() => setOpen(false)} href="#work">Résultats</MobLink>
              <MobLink onClick={() => setOpen(false)} href="#faq">FAQ</MobLink>
              <MobLink onClick={() => setOpen(false)} href="#calculator">
                <Calculator className="w-4 h-4 inline mr-2" /> Simulateur ROI
              </MobLink>
              <MobLink onClick={() => setOpen(false)} href="#pricing">Tarifs</MobLink>
            </nav>
            <div className="p-4 border-t border-white/5">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm text-center flex items-center justify-center gap-2"
              >
                Démarrer un projet <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="px-4 py-3 rounded-lg text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors"
    >
      {children}
    </a>
  );
}
