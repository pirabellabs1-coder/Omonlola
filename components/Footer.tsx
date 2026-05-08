import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

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
          <Image src="/logo.svg" alt="" width={32} height={32} className="w-8 h-8" />
          <span className="text-white tracking-tight">Omonlola</span>
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted font-mono uppercase">
        <p>© {new Date().getFullYear()} Omonlola. Tous droits réservés.</p>

        <a
          href="https://pirabellabs.com"
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:border-brand/30 hover:bg-brand/5 transition-all"
        >
          <span className="relative flex items-center justify-center w-4 h-4">
            <span className="absolute inset-0 rounded-full bg-brand/30 blur-md group-hover:bg-brand/50 transition-colors" />
            <Sparkles className="relative w-3 h-3 text-brand" />
          </span>
          <span className="font-sans normal-case tracking-normal text-[11px]">
            Réalisé par{" "}
            <span className="font-bold text-white group-hover:text-brand transition-colors">
              Pirabel Labs
            </span>
            <span className="text-text-muted"> · Agence Web &amp; Marketing</span>
          </span>
        </a>
      </div>
    </footer>
  );
}
