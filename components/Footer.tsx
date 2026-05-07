import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#020202] pt-24 pb-8 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center overflow-hidden z-0 pointer-events-none select-none opacity-5">
        <h1 className="font-display font-bold text-[clamp(100px,20vw,350px)] leading-none text-white whitespace-nowrap">
          OMONLOLA
        </h1>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <Link href="/" className="font-display font-bold text-2xl flex items-center gap-2">
          <Zap className="text-brand w-6 h-6" />
          <span className="text-white tracking-tight">Omonlola</span>
          <span className="text-brand">AI</span>
        </Link>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted font-mono uppercase">
        <p>© 2026 Omonlola AI. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
