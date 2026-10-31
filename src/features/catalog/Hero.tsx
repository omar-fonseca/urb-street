import { WAIcon } from "@/components/Brand";
import { waLink } from "@/features/whatsapp/waLink";

const MODEL_SRC = "/hero/model.png";
const REAL_SRC = "/hero/lettering/real.png";
const STYLE_SRC = "/hero/lettering/style.png";
const EVERYDAY_SRC = "/hero/lettering/everyday.png";

export function Hero({ firstCatId }: { firstCatId: string }) {
  return (
    <section className="hero-stage grunge-overlay relative min-h-0 md:min-h-[100svh] flex flex-col items-center justify-start md:justify-center text-center overflow-x-hidden overflow-y-hidden">
      <div className="absolute inset-0 z-0 bg-[#050505]" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/25 via-transparent to-[#050505]/50" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8151B] z-10" aria-hidden />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col items-center gap-3 md:gap-3.5 pt-16 md:pt-20 pb-5 md:pb-8">
        {/*
          Shared composition: smoke anchored HERE (behind lettering), then letters, then model.
        */}
        <div className="hero-compose relative w-full max-w-[380px] sm:max-w-[460px] md:max-w-[560px] mx-auto">
          <h1 className="sr-only">REAL STYLE. EVERYDAY.</h1>

          {/* Smoke emerges from lettering zone — always behind letters + model */}
          <div className="hero-smoke" aria-hidden="true">
            <div className="hero-smoke-plume hero-smoke-p1" />
            <div className="hero-smoke-plume hero-smoke-p2" />
          </div>

          <div className="hero-lettering absolute inset-0 z-10" aria-hidden="true">
            <img
              src={REAL_SRC}
              alt=""
              className="hero-word hero-word-real"
              decoding="async"
              draggable={false}
            />
            <img
              src={STYLE_SRC}
              alt=""
              className="hero-word hero-word-style"
              decoding="async"
              draggable={false}
            />
            <img
              src={EVERYDAY_SRC}
              alt=""
              className="hero-word hero-word-everyday"
              decoding="async"
              draggable={false}
            />
          </div>

          <img
            src={MODEL_SRC}
            alt=""
            width={682}
            height={1024}
            className="hero-model pointer-events-none select-none"
            decoding="async"
            fetchPriority="high"
            aria-hidden="true"
            draggable={false}
          />
        </div>

        <p className="font-condensed text-base sm:text-lg md:text-2xl text-[#888] uppercase tracking-[0.2em] md:tracking-[0.25em] max-w-md px-2">
          Ropa urbana auténtica — lo que la calle necesita
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-1 w-full sm:w-auto max-w-md sm:max-w-none justify-center">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] text-[#0A0A0A] px-8 py-3.5 md:py-4 font-condensed font-black text-base md:text-lg uppercase tracking-widest hover:bg-[#20C05A] transition-all hover:scale-105 active:scale-95"
          >
            <WAIcon size={22} />
            Hablar por WhatsApp
          </a>
          <button
            type="button"
            onClick={() =>
              document.getElementById(firstCatId)?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center justify-center gap-2 border-2 border-[#F5F5F5] text-[#F5F5F5] px-8 py-3.5 md:py-4 font-condensed font-bold text-base md:text-lg uppercase tracking-widest hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-all"
          >
            Ver Catálogo
          </button>
        </div>

        <div className="mt-4 md:mt-6 animate-bounce" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
