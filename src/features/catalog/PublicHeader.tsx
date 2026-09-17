import { useEffect, useState } from "react";
import { Logo, WAIcon } from "@/components/Brand";
import { waBaseLink } from "@/features/whatsapp/waLink";
import type { CatalogCategory } from "@/types/catalog";

interface PublicHeaderProps {
  cats: CatalogCategory[];
  onAdminMenu?: () => void;
}

export function PublicHeader({ cats, onAdminMenu }: PublicHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dotsOpen, setDotsOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "border-[#2A2A2A] bg-[#0A0A0Af5] backdrop-blur-lg"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Logo size="sm" />
        </button>
        <nav className="hidden md:flex items-center gap-5 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => go(c.slug)}
              className="font-condensed font-bold text-sm tracking-widest text-[#888] hover:text-[#F5F5F5] transition-colors uppercase whitespace-nowrap"
            >
              {c.nombre}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={waBaseLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#25D366] text-[#0A0A0A] px-4 py-2 font-condensed font-black text-sm uppercase tracking-widest hover:bg-[#20C05A] transition-colors"
          >
            <WAIcon size={15} />
            WhatsApp
          </a>

          {onAdminMenu && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDotsOpen((v) => !v)}
                className="w-9 h-9 text-[#555] hover:text-[#F5F5F5] flex items-center justify-center text-xl"
                aria-label="Más opciones"
              >
                ⋮
              </button>
              {dotsOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#0F0F0F] border border-[#2A2A2A] z-50">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2.5 font-condensed text-sm uppercase tracking-widest text-[#888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"
                    onClick={() => {
                      setDotsOpen(false);
                      onAdminMenu();
                    }}
                  >
                    Administrador
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="Menú"
          >
            <span
              className={`block w-6 h-0.5 bg-[#F5F5F5] transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span className={`block w-6 h-0.5 bg-[#F5F5F5] transition-all ${open ? "opacity-0" : ""}`} />
            <span
              className={`block w-6 h-0.5 bg-[#F5F5F5] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#0F0F0F] border-t border-[#2A2A2A] px-4 py-4 flex flex-col gap-3">
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => go(c.slug)}
              className="font-condensed font-bold text-lg tracking-widest text-[#F5F5F5] uppercase text-left py-2 border-b border-[#1E1E1E]"
            >
              {c.nombre}
            </button>
          ))}
          <a
            href={waBaseLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-[#0A0A0A] px-4 py-3 font-condensed font-black text-base uppercase tracking-widest mt-2"
          >
            <WAIcon size={18} />
            Contáctanos por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
