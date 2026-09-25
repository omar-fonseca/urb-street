import { useEffect, useRef, useState, type ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  autoplay?: boolean;
  intervalMs?: number;
  emptyLabel?: string;
}

/** Pause autoplay after manual nav so it does not double-advance. */
const MANUAL_PAUSE_MS = 8000;

function cardStep(el: HTMLDivElement): number {
  const child = el.firstElementChild as HTMLElement | null;
  if (!child) return 304;
  const gapRaw = getComputedStyle(el).gap || getComputedStyle(el).columnGap || "16";
  const gap = Number.parseFloat(gapRaw) || 16;
  return child.offsetWidth + gap;
}

export function Carousel({
  children,
  autoplay = false,
  intervalMs = 5000,
  emptyLabel = "Sin productos visibles",
}: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pauseUntilRef = useRef(0);
  const [hasItems, setHasItems] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setHasItems(el.childElementCount > 0);
  }, [children]);

  useEffect(() => {
    if (!autoplay) return;
    const el = ref.current;
    if (!el) return;

    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      const step = cardStep(el);
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + step;
      el.scrollTo({
        left: next >= max - 8 ? 0 : next,
        behavior: "smooth",
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [autoplay, intervalMs, children]);

  const pauseAutoplay = () => {
    pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
  };

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    pauseAutoplay();
    const step = cardStep(el);
    el.scrollBy({
      left: dir === "right" ? step : -step,
      behavior: "smooth",
    });
  };

  if (!hasItems) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-[#2A2A2A] text-[#444] font-condensed uppercase tracking-widest text-sm">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        onPointerDown={pauseAutoplay}
        onTouchStart={pauseAutoplay}
        onWheel={pauseAutoplay}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-[45%] -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-[#E8151B] text-white flex items-center justify-center hover:bg-[#FF2020] transition-colors active:scale-90"
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-[45%] -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-[#E8151B] text-white flex items-center justify-center hover:bg-[#FF2020] transition-colors active:scale-90"
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
