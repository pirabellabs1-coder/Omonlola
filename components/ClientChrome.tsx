"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Global client-side chrome for the landing page:
 * - Preloader
 * - Smooth scroll (Lenis)
 * - Custom cursor (desktop only)
 * - Magnetic buttons (GSAP)
 * - GSAP reveal-on-load for `.gsap-reveal`
 * - Scroll progress bar + navbar background swap
 */
export default function ClientChrome() {
  const [progress, setProgress] = useState(0);
  const [hidePreloader, setHidePreloader] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const outlineRef = useRef<HTMLDivElement | null>(null);

  // Preloader counter
  useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      count += Math.floor(Math.random() * 15) + 1;
      if (count > 100) count = 100;
      setProgress(count);
      if (count === 100) {
        clearInterval(id);
        setTimeout(() => setHidePreloader(true), 500);
      }
    }, 25);
    return () => clearInterval(id);
  }, []);

  // GSAP reveal once preloader done
  useEffect(() => {
    if (!hidePreloader) return;
    let cancelled = false;
    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        ".gsap-reveal",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );

      // Parallax text
      gsap.to(".parallax-text", {
        xPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: ".parallax-text", scrub: 1 }
      });
      gsap.to(".parallax-text-reverse", {
        xPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: ".parallax-text", scrub: 1 }
      });

      // Magnetic buttons
      const cleanups: Array<() => void> = [];
      document.querySelectorAll<HTMLElement>(".magnetic-btn").forEach((btn) => {
        const move = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        };
        const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        btn.addEventListener("mousemove", move);
        btn.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", move);
          btn.removeEventListener("mouseleave", leave);
        });
      });

      return () => cleanups.forEach((c) => c());
    })();
    return () => {
      cancelled = true;
    };
  }, [hidePreloader]);

  // Lenis smooth scroll
  useEffect(() => {
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    (async () => {
      const Lenis = (await import("@studio-freight/lenis")).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
      const tick = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy?.();
    };
  }, []);

  // Scroll progress + navbar bg
  useEffect(() => {
    const onScroll = () => {
      const scrollTotal = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const bar = document.getElementById("scroll-progress");
      if (bar) bar.style.width = `${(scrollTotal / Math.max(height, 1)) * 100}%`;
      const navbar = document.getElementById("navbar");
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.replace("bg-dark/70", "bg-dark/95");
        } else {
          navbar.classList.replace("bg-dark/95", "bg-dark/70");
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Custom cursor (desktop only)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("has-custom-cursor");
    let cursorX = 0,
      cursorY = 0,
      outlineX = 0,
      outlineY = 0;
    const move = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = cursorX + "px";
        dotRef.current.style.top = cursorY + "px";
      }
    };
    let raf = 0;
    const animate = () => {
      outlineX += (cursorX - outlineX) * 0.15;
      outlineY += (cursorY - outlineY) * 0.15;
      if (outlineRef.current) {
        outlineRef.current.style.left = outlineX + "px";
        outlineRef.current.style.top = outlineY + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(animate);

    const enter = () => document.body.classList.add("hovering");
    const leave = () => document.body.classList.remove("hovering");
    const hoverables = document.querySelectorAll('.hoverable, a, button, input[type="range"]');
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  // Hero particles
  useEffect(() => {
    const container = document.getElementById("hero-particles");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 25; i++) {
      const p = document.createElement("div");
      p.className = "hero-particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = Math.random() * 20 + "%";
      p.style.animationDelay = Math.random() * 8 + "s";
      p.style.animationDuration = 6 + Math.random() * 6 + "s";
      const size = 2 + Math.random() * 3;
      p.style.width = size + "px";
      p.style.height = size + "px";
      container.appendChild(p);
    }
  }, []);

  return (
    <>
      <div id="scroll-progress" />
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={outlineRef} className="cursor-outline hidden md:block" />
      {!hidePreloader && (
        <div id="preloader" style={{ opacity: progress === 100 ? 0 : 1, transition: "opacity 0.5s" }}>
          <div className="flex flex-col items-center">
            <div className="font-display font-bold text-4xl mb-8 flex items-center gap-2">
              <span className="text-white">Omonlola</span>
              <span className="text-brand">AI</span>
            </div>
            <div className="w-64 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-brand shadow-[0_0_15px_#0066FF]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs font-mono text-text-muted mt-4 tracking-widest font-bold">
              {(progress < 10 ? "0" : "") + progress + "%"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
