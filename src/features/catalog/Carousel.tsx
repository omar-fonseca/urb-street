import { useEffect, useRef, useState, type ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  autoplay?: boolean;
  intervalMs?: number;
  emptyLabel?: string;
}

export function Carousel({
  children,
  autoplay = false,
  intervalMs = 4500,
  emptyLabel = "Sin productos visibles",
}: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
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
      const step = 288 + 16;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + step * 2;
      el.scrollTo({
        left: next >= max - 8 ? 0 : next,
        behavior: "smooth",
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [autoplay, intervalMs, children]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const step = 288 + 16;
    el.scrollBy({ left: dir === "right" ? step * 2 : -(step * 2), behavior: "smooth" });
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
