export default function Manifesto() {
  return (
    <section className="py-20 md:py-24 relative overflow-hidden bg-[#020202] flex flex-col justify-center min-h-[40vh] md:min-h-[50vh]">
      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        <h2 className="font-display font-black text-[clamp(20px,5vw,70px)] leading-[1.05] md:leading-none uppercase md:whitespace-nowrap parallax-text text-outline-bright opacity-30">
          Cessez de deviner.
        </h2>
        <h2 className="font-display font-black text-[clamp(22px,6vw,85px)] leading-[1.05] md:leading-none uppercase md:whitespace-nowrap parallax-text-reverse text-brand drop-shadow-[0_0_40px_rgba(0,102,255,0.8)] ml-6 md:ml-32 py-1 md:py-2">
          Investissez dans la data.
        </h2>
        <h2 className="font-display font-black text-[clamp(20px,5vw,70px)] leading-[1.05] md:leading-none uppercase md:whitespace-nowrap parallax-text text-outline-bright opacity-30 ml-3 md:ml-16">
          Développez vos revenus.
        </h2>
      </div>
    </section>
  );
}
