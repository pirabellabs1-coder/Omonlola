import Image from "next/image";
import { BarChart3, PenTool, Target, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen pt-32 pb-10 flex flex-col items-center justify-center overflow-hidden z-10"
    >
      <div className="absolute inset-0 bg-dark z-0" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand/30 blur-[120px] rounded-full pointer-events-none z-0 animate-blob mix-blend-screen" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand/20 blur-[150px] rounded-full pointer-events-none z-0 animate-blob mix-blend-screen"
        style={{ animationDelay: "2s" }}
      />

      <div id="hero-particles" className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" />

      <div className="hero-glow-ring w-[300px] h-[300px] bottom-[15%] left-1/2 z-[2]" />
      <div
        className="hero-glow-ring w-[500px] h-[500px] bottom-[10%] left-1/2 z-[2]"
        style={{ animationDelay: "1.3s" }}
      />
      <div
        className="hero-glow-ring w-[700px] h-[700px] bottom-[5%] left-1/2 z-[2]"
        style={{ animationDelay: "2.6s" }}
      />

      <div className="hero-shimmer top-[30%] z-[1]" />
      <div className="hero-shimmer top-[60%] z-[1]" style={{ animationDelay: "1.5s" }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-grid [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] h-[120%] -top-[10%]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-20 text-center flex flex-col items-center mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-md gsap-reveal hoverable shadow-[0_0_20px_rgba(0,102,255,0.1)]">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_10px_#0066FF]" />
          <span className="text-xs font-bold tracking-widest text-text-muted uppercase">
            Media Buyer · Meta Ads Specialist
          </span>
        </div>

        <h1 className="text-[clamp(32px,4.5vw,64px)] font-display font-black tracking-tight leading-[1.1] text-white mb-6 max-w-5xl gsap-reveal drop-shadow-2xl">
          Je transforme vos campagnes pour <br className="hidden md:block" />
          <span className="text-brand-gradient drop-shadow-[0_0_30px_rgba(0,102,255,0.3)]">
            attirer, retenir et convertir.
          </span>
        </h1>

        <p className="text-text-muted text-lg max-w-2xl mx-auto mb-20 gsap-reveal">
          Fini les dépenses sans visibilité. Je conçois des systèmes d&apos;acquisition pilotés par la data pour
          maximiser durablement votre ROAS.
        </p>

        <div className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[500px] flex justify-center items-end gsap-reveal">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[500px] bg-brand rounded-full blur-[100px] z-0 opacity-80 animate-pulse pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[300px] bg-white rounded-full blur-[120px] z-0 opacity-30 pointer-events-none" />

          <Image
            src="https://i.postimg.cc/RMVxXtV9/Whats-App-Image-2026-05-06-at-13-36-41.png"
            alt="Omonlola Portrait"
            width={500}
            height={600}
            priority
            className="absolute bottom-0 h-full w-auto object-contain object-bottom z-10 drop-shadow-[0_-10px_40px_rgba(0,102,255,0.3)] mask-bottom filter contrast-125"
            unoptimized
          />

          <div className="glass-pill absolute top-0 left-0 md:left-20 animate-float z-20 hoverable !border-brand/30 shadow-[0_0_20px_rgba(0,102,255,0.2)]">
            <div className="w-6 h-6 rounded bg-brand flex items-center justify-center">
              <Target className="w-3 h-3 text-white" />
            </div>{" "}
            Target &amp; Audiences
          </div>
          <div className="glass-pill absolute top-20 right-0 md:right-10 animate-float-delayed z-20 hoverable shadow-[0_0_20px_rgba(0,102,255,0.1)]">
            <div className="w-6 h-6 rounded bg-brand/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-brand" />
            </div>{" "}
            Scaling Stratégique
          </div>
          <div className="glass-pill absolute bottom-32 left-4 md:left-10 animate-float-delayed z-20 hoverable shadow-[0_0_20px_rgba(0,102,255,0.1)]">
            <div className="w-6 h-6 rounded bg-brand/20 flex items-center justify-center">
              <PenTool className="w-3 h-3 text-brand" />
            </div>{" "}
            Creative Strategy
          </div>
          <div className="glass-pill absolute bottom-16 right-4 md:right-20 animate-float z-20 hoverable !border-brand/30 shadow-[0_0_20px_rgba(0,102,255,0.2)]">
            <div className="w-6 h-6 rounded bg-brand flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>{" "}
            ROAS Mesurable
          </div>
        </div>
      </div>
    </section>
  );
}
