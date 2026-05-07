"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const VIDEO_SRC = "/videos/showreel.mp4"; // place your file at public/videos/showreel.mp4
const POSTER_SRC = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1600";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section id="video" className="py-24 md:py-32 relative bg-dark border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Showreel</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Découvrez ma <span className="text-brand-gradient italic">méthode en vidéo.</span>
          </h2>
          <p className="text-text-muted text-lg">
            En 90 secondes, je vous montre comment je transforme un compte Meta Ads en machine à acquisition rentable.
          </p>
        </div>

        <div className="video-frame group aspect-video relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={POSTER_SRC}
            playsInline
            preload="metadata"
            muted={muted}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>

          {!playing && (
            <button
              onClick={togglePlay}
              aria-label="Lancer la vidéo"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent hoverable"
            >
              <span className="relative flex items-center justify-center">
                <span className="absolute w-32 h-32 rounded-full bg-brand/30 blur-2xl group-hover:bg-brand/50 transition" />
                <span className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand flex items-center justify-center shadow-[0_0_40px_rgba(0,102,255,0.6)] group-hover:scale-110 transition">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </span>
              </span>
            </button>
          )}

          {playing && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={togglePlay}
                aria-label="Pause"
                className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand/80 transition"
              >
                <Pause className="w-5 h-5" />
              </button>
              <button
                onClick={toggleMute}
                aria-label={muted ? "Activer le son" : "Couper le son"}
                className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand/80 transition"
              >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-text-muted text-xs mt-6 font-mono uppercase tracking-widest">
          Astuce : déposez votre vidéo dans <span className="text-brand">/public/videos/showreel.mp4</span>
        </p>
      </div>
    </section>
  );
}
