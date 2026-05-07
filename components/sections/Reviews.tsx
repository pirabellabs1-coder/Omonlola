import { Quote, Star } from "lucide-react";
import type { Review } from "@/lib/types";

export default function Reviews({ items }: { items: Review[] }) {
  if (items.length === 0) return null;

  // Split evenly into two rows for the dual marquee.
  // If there are too few items, we fall back to a single row.
  const useDual = items.length >= 4;
  const half = Math.ceil(items.length / 2);
  const row1 = useDual ? items.slice(0, half) : items;
  const row2 = useDual ? items.slice(half) : [];

  return (
    <section id="reviews" className="py-32 relative border-t border-white/5 bg-[#020202] overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-brand/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-[0.2em] text-brand mb-4 uppercase">Témoignages</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Ce que mes clients <span className="text-brand-gradient italic">disent.</span>
          </h2>
          <p className="text-text-muted text-lg">
            Des retours réels de marques qui ont transformé leur acquisition Meta Ads avec moi.
          </p>
        </div>

        <div className="space-y-5">
          <MarqueeRow items={row1} direction="left" />
          {useDual && row2.length > 0 && <MarqueeRow items={row2} direction="right" />}
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({ items, direction }: { items: Review[]; direction: "left" | "right" }) {
  // Duplicate the list so the loop is seamless.
  const looped = [...items, ...items];
  return (
    <div className="marquee-row overflow-hidden">
      <div className={`marquee-track ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {looped.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="glass-card p-7 relative w-[330px] sm:w-[360px] shrink-0 flex flex-col">
      <Quote className="absolute top-5 right-5 w-7 h-7 text-brand/15" />
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < review.rating ? "fill-amber-400 text-amber-400" : "text-white/15"
            }`}
          />
        ))}
      </div>
      <p className="text-white/85 text-sm leading-relaxed mb-6 line-clamp-5">&ldquo;{review.content}&rdquo;</p>
      <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
        <div className="w-10 h-10 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold shrink-0 overflow-hidden">
          {review.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
          ) : (
            review.name?.[0]?.toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-white text-sm truncate">{review.name}</div>
          <div className="text-xs text-text-muted truncate">
            {[review.role, review.company].filter(Boolean).join(" · ") || ""}
          </div>
        </div>
      </div>
    </article>
  );
}
