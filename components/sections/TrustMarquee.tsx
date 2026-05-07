import { Box, Circle, Hexagon, Octagon, Triangle } from "lucide-react";

export default function TrustMarquee() {
  const items = [
    { Icon: Hexagon, label: "KAARAMOO" },
    { Icon: Triangle, label: "NEXED" },
    { Icon: Circle, label: "WABAJOB" },
    { Icon: Box, label: "ECOM SÉNÉGAL" },
    { Icon: Octagon, label: "SAAS QUÉBEC" },
    { Icon: Hexagon, label: "KAARAMOO" },
    { Icon: Triangle, label: "NEXED" }
  ];
  return (
    <section className="py-6 border-y border-white/5 bg-white/[0.02] overflow-hidden relative">
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
      <div className="flex items-center gap-12 animate-marquee opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        <span className="text-sm font-bold tracking-[0.2em] text-white uppercase mr-8">
          Ils me confient leur budget :
        </span>
        {items.map(({ Icon, label }, i) => (
          <div key={i} className="font-display font-bold text-xl flex items-center gap-2">
            <Icon className="w-5 h-5" /> {label}
          </div>
        ))}
      </div>
    </section>
  );
}
