import { Logo, WAIcon } from "@/components/Brand";
import { WHATSAPP_DISPLAY, waBaseLink, waLink } from "@/features/whatsapp/waLink";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#2A2A2A] py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <Logo size="sm" />
        <div className="text-center md:text-right">
          <p className="font-condensed text-[#888] text-sm uppercase tracking-widest">
            Preguntas y pedidos por WhatsApp
          </p>
          <a
            href={waBaseLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center md:justify-end mt-2 text-[#25D366] font-condensed font-bold text-base tracking-wide hover:text-[#20C05A] transition-colors"
          >
            <WAIcon size={16} />
            {WHATSAPP_DISPLAY}
          </a>
          <p className="font-condensed text-[#444] text-xs uppercase tracking-widest mt-4">
            © {new Date().getFullYear()} URB&amp;STREET — Real Style. Everyday.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWA() {
  return (
    <a
      href={waBaseLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform active:scale-95"
      aria-label="WhatsApp"
    >
      <WAIcon size={28} />
    </a>
  );
}

export function WhatsAppBanner() {
  return (
    <div className="bg-[#25D366] py-4">
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 text-[#0A0A0A] font-condensed font-black text-lg md:text-xl uppercase tracking-widest hover:opacity-80 transition-opacity"
      >
        <WAIcon size={24} />
        ¿Listo para pedir? Escríbenos ahora por WhatsApp →
      </a>
    </div>
  );
}
