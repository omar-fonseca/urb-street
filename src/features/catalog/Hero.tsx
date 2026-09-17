import { Logo, WAIcon } from "@/components/Brand";
import { waLink } from "@/features/whatsapp/waLink";

export function Hero({ firstCatId }: { firstCatId: string }) {
  return (
    <section className="grunge-overlay relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
        <div
          className="w-full h-full opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 20%, #E8151B33 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #333 0%, transparent 45%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8151B] z-10" />
      <div className="relative z-10 px-4 max-w-5xl mx-auto flex flex-col items-center gap-8 pt-24">
        <Logo size="lg" />
        <div className="mt-4">
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-[#F5F5F5] leading-none tracking-tight">
            REAL STYLE.
          </h1>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-[#E8151B] leading-none tracking-tight">
            EVERYDAY.
          </h1>
        </div>
        <p className="font-condensed text-lg md:text-2xl text-[#888] uppercase tracking-[0.25em] max-w-md">
          Ropa urbana auténtica — lo que la calle necesita
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] text-[#0A0A0A] px-8 py-4 font-condensed font-black text-lg uppercase tracking-widest hover:bg-[#20C05A] transition-all hover:scale-105 active:scale-95"
          >
            <WAIcon size={22} />
            Hablar por WhatsApp
          </a>
          <button
            type="button"
            onClick={() =>
              document.getElementById(firstCatId)?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center justify-center gap-2 border-2 border-[#F5F5F5] text-[#F5F5F5] px-8 py-4 font-condensed font-bold text-lg uppercase tracking-widest hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-all"
          >
            Ver Catálogo
          </button>
        </div>
        <div className="mt-12 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
