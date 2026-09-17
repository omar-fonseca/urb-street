import { useState, useRef, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const WA_DEFAULT = "573001234567";
const ADMIN_USER = "admin";
const ADMIN_PASS = "urb2024";
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=750&fit=crop&auto=format`;

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  img: string;
  visible: boolean;
}
interface Category {
  id: string;
  label: string;
  products: Product[];
  comingSoon?: boolean;
  comingSoonItems?: string[];
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const HATS = [
  U("1588850561407-ed78c282e89b"),
  U("1521369909029-2afed882baee"),
  U("1534215754734-18e55d13e346"),
  U("1556306535-0f09a537f0a3"),
  U("1473646879798-7af2f97da3f0"),
  U("1594938298603-c8148b6c5d5c"),
];
const GORRAS_ESTILOS = [
  "Adidas","Amiri","AP Crown","Armani","Beisboleras",
  "Burberry","Calvin Klein","Clemont","Coach","Dior",
  "Dolce Gabana","Fendi","Ferrari","Gucci","Hugo Boss",
  "Jordan","Lacoste","Mercedes Benz","Monasteri","Moncler",
  "Palm Angels","Polo Ralph Lauren","Quicksilver","Tommy Hilfiger","Westcol",
];

const INIT_CATS: Category[] = [
  {
    id: "gorras",
    label: "GORRAS 1.1",
    products: GORRAS_ESTILOS.map((name, i) => ({
      id: `g${i}`, name, img: HATS[i % HATS.length], visible: true,
    })),
  },
  {
    id: "camisetas",
    label: "CAMISETAS",
    products: [
      { id: "cam1", name: "Camisetas 1.1",      img: U("1521572163474-6864f9cf17ab"), visible: true },
      { id: "cam2", name: "Oversize",            img: U("1583743814966-8936f5b7be1a"), visible: true },
      { id: "cam3", name: "Oversize sin mangas", img: U("1503341504253-dff4815485f1"), visible: true },
      { id: "cam4", name: "Texturizada",         img: U("1618354691373-d851c5c3a990"), visible: true },
    ],
  },
  {
    id: "pantalones",
    label: "PANTALONES",
    products: [
      { id: "pan1", name: "Jeans Slim fit",           img: U("1624378439575-d8705ad7ae80"), visible: true },
      { id: "pan2", name: "Jogger jean con bolsillo", img: U("1542272604-787c3835535d"),    visible: true },
      { id: "pan3", name: "Jogger jean sin bolsillo", img: U("1541099649105-f69ad21f3246"), visible: true },
      { id: "pan4", name: "Sudaderas 1.1",            img: U("1562157873-818bc0726f68"),    visible: true },
    ],
  },
  {
    id: "conjuntos",
    label: "CONJUNTOS",
    products: [
      { id: "con1", name: "Importados 1.1",     img: U("1529139574466-a303027c1d8b"), visible: true },
      { id: "con2", name: "Oversize",           img: U("1523304855040-d1d4e9f79e37"), visible: true },
      { id: "con3", name: "Oversize sin manga", img: U("1516826957135-700dedea698c"), visible: true },
      { id: "con4", name: "Texturizado",        img: U("1617038220319-276d3cfab638"), visible: true },
    ],
  },
  {
    id: "pantalonetas",
    label: "PANTALONETAS",
    products: [
      { id: "pnt1", name: "Bermudas de jean", img: U("1568702846914-96b305d2aaeb"), visible: true },
      { id: "pnt2", name: "Pantaloneta",      img: U("1547949003-9792a18a2601"),    visible: true },
    ],
  },
  {
    id: "zapatos",
    label: "ZAPATOS",
    comingSoon: true,
    comingSoonItems: ["Adidas", "Puma", "Otras marcas"],
    products: [],
  },
  {
    id: "accesorios",
    label: "ACCESORIOS",
    comingSoon: true,
    comingSoonItems: ["Reloj", "Carteras", "Perfumes", "Cadenas sencillas"],
    products: [],
  },
];

// ─── WA HELPER ────────────────────────────────────────────────────────────────
function waLink(wa: string, prenda?: string) {
  const msg = prenda
    ? `Hola, me interesa esta prenda: *${prenda}*. ¿Está disponible y cuál es el precio?`
    : "Hola URB&STREET, quiero hacer un pedido.";
  return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
}

// ─── SHARED ICONS ─────────────────────────────────────────────────────────────
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 0.55 : size === "lg" ? 1.2 : 0.8;
  return (
    <svg width={220 * s} height={90 * s} viewBox="0 0 220 90" fill="none">
      <path d="M85 18L90 8l5 8 5-10 5 10 5-8 5 10Z" fill="#F5F5F5" />
      <circle cx="172" cy="13" r="9" stroke="#F5F5F5" strokeWidth="1.5" fill="none" />
      <path d="M163 13Q172 6 181 13Q172 20 163 13Z" stroke="#F5F5F5" strokeWidth="1" fill="none" />
      <line x1="172" y1="4" x2="172" y2="22" stroke="#F5F5F5" strokeWidth="1" />
      <text x="110" y="52" textAnchor="middle" fontFamily="'Permanent Marker',cursive"
        fontSize="30" fill="#F5F5F5" letterSpacing="2">URB&amp;STREET</text>
      <rect x="20" y="60" width="180" height="2" fill="#F5F5F5" rx="1" />
      <rect x="20" y="65" width="180" height="1" fill="#E8151B" rx="0.5" />
      <text x="110" y="82" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif"
        fontSize="10" fontWeight="700" fill="#888" letterSpacing="4">REAL STYLE. EVERYDAY.</text>
    </svg>
  );
}

function WAIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC VIEW
// ─────────────────────────────────────────────────────────────────────────────

function ProductCard({ product, wa }: { product: Product; wa: string }) {
  return (
    <div className="product-card flex-none w-64 md:w-72 bg-[#141414] border border-[#2A2A2A] overflow-hidden"
      style={{ scrollSnapAlign: "start" }}>
      <div className="relative overflow-hidden bg-[#1A1A1A] aspect-[4/5]">
        <img src={product.img} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[48px] border-t-[#E8151B] border-r-[48px] border-r-transparent" />
      </div>
      <div className="p-4">
        <p className="font-condensed text-base font-bold uppercase tracking-wider text-[#F5F5F5] leading-tight mb-3">
          {product.name}
        </p>
        <a href={waLink(wa, product.name)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-[#0A0A0A] font-condensed font-black text-sm uppercase tracking-widest transition-all duration-200 hover:bg-[#20C05A] active:scale-95">
          <WAIcon size={16} />
          Preguntar
        </a>
      </div>
    </div>
  );
}

function Carousel({ products, wa }: { products: Product[]; wa: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = products.filter((p) => p.visible);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const step = 288 + 16;
    el.scrollBy({ left: dir === "right" ? step * 2 : -(step * 2), behavior: "smooth" });
  };

  if (visible.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-[#2A2A2A] text-[#444] font-condensed uppercase tracking-widest text-sm">
        Sin productos visibles
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
        {visible.map((p) => <ProductCard key={p.id} product={p} wa={wa} />)}
      </div>
      <button onClick={() => scroll("left")}
        className="absolute left-0 top-[45%] -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-[#E8151B] text-white flex items-center justify-center hover:bg-[#FF2020] transition-colors active:scale-90"
        aria-label="Anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button onClick={() => scroll("right")}
        className="absolute right-0 top-[45%] -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-[#E8151B] text-white flex items-center justify-center hover:bg-[#FF2020] transition-colors active:scale-90"
        aria-label="Siguiente">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

function ComingSoonSection({ category, wa }: { category: Category; wa: string }) {
  return (
    <section id={category.id} className="py-16 md:py-24 opacity-70">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-10 bg-[#444]" />
          <h2 className="font-condensed font-black text-4xl md:text-5xl uppercase tracking-widest text-[#555]">
            {category.label}
          </h2>
          <div className="flex-1 h-px bg-[#1E1E1E] ml-2" />
          <span className="font-condensed font-black text-xs uppercase tracking-[0.3em] text-[#E8151B] border border-[#E8151B] px-3 py-1">
            PRÓXIMAMENTE
          </span>
        </div>
        <div className="flex gap-4 overflow-x-hidden">
          {(category.comingSoonItems ?? []).map((item, i) => (
            <div key={i}
              className="flex-none w-64 md:w-72 bg-[#0F0F0F] border border-dashed border-[#1E1E1E] overflow-hidden">
              <div className="aspect-[4/5] bg-[#111] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-2 border-dashed border-[#2A2A2A] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <span className="font-condensed text-[#444] text-xs uppercase tracking-widest">Sin foto aún</span>
              </div>
              <div className="p-4">
                <p className="font-condensed text-base font-bold uppercase tracking-wider text-[#444] leading-tight mb-3">
                  {item}
                </p>
                <a href={waLink(wa, item)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1A1A1A] text-[#555] font-condensed font-black text-sm uppercase tracking-widest border border-[#2A2A2A] hover:border-[#25D366] hover:text-[#25D366] transition-all">
                  <WAIcon size={14} />
                  Consultar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection({ category, wa }: { category: Category; wa: string }) {
  if (category.comingSoon) return <ComingSoonSection category={category} wa={wa} />;
  return (
    <section id={category.id} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-10 bg-[#E8151B]" />
          <h2 className="font-condensed font-black text-4xl md:text-5xl uppercase tracking-widest text-[#F5F5F5]">
            {category.label}
          </h2>
          <div className="flex-1 h-px bg-[#2A2A2A] ml-2" />
          <span className="font-condensed text-xs text-[#555] uppercase tracking-widest">
            {category.products.filter(p => p.visible).length} estilos
          </span>
        </div>
        <div className="px-6 md:px-8">
          <Carousel products={category.products} wa={wa} />
        </div>
        <div className="mt-10 flex justify-center">
          <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hola, quiero ver más opciones de ${category.label}.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#888] font-condensed font-semibold text-sm uppercase tracking-widest hover:text-[#25D366] transition-colors">
            <WAIcon size={14} />
            Ver más {category.label.toLowerCase()} →
          </a>
        </div>
      </div>
    </section>
  );
}

function PublicHeader({ cats, wa }: { cats: Category[]; wa: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      scrolled ? "border-[#2A2A2A] bg-[#0A0A0Af5] backdrop-blur-lg" : "border-transparent bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Logo size="sm" />
        </button>
        <nav className="hidden md:flex items-center gap-5 overflow-x-auto">
          {cats.map((c) => (
            <button key={c.id} onClick={() => go(c.id)}
              className="font-condensed font-bold text-sm tracking-widest text-[#888] hover:text-[#F5F5F5] transition-colors uppercase whitespace-nowrap">
              {c.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#25D366] text-[#0A0A0A] px-4 py-2 font-condensed font-black text-sm uppercase tracking-widest hover:bg-[#20C05A] transition-colors">
            <WAIcon size={15} />
            WhatsApp
          </a>
          <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-1" aria-label="Menú">
            <span className={`block w-6 h-0.5 bg-[#F5F5F5] transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#F5F5F5] transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#F5F5F5] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#0F0F0F] border-t border-[#2A2A2A] px-4 py-4 flex flex-col gap-3">
          {cats.map((c) => (
            <button key={c.id} onClick={() => go(c.id)}
              className="font-condensed font-bold text-lg tracking-widest text-[#F5F5F5] uppercase text-left py-2 border-b border-[#1E1E1E]">
              {c.label}
              {c.comingSoon && <span className="ml-2 text-xs text-[#E8151B]">próximamente</span>}
            </button>
          ))}
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-[#0A0A0A] px-4 py-3 font-condensed font-black text-base uppercase tracking-widest mt-2">
            <WAIcon size={18} />
            Contáctanos por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}

function Hero({ firstCatId, wa }: { firstCatId: string; wa: string }) {
  return (
    <section className="grunge-overlay relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=900&fit=crop&auto=format"
          alt="Streetwear" className="w-full h-full object-cover opacity-25" />
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
          <a href={waLink(wa)} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] text-[#0A0A0A] px-8 py-4 font-condensed font-black text-lg uppercase tracking-widest hover:bg-[#20C05A] transition-all hover:scale-105 active:scale-95">
            <WAIcon size={22} />
            Hablar por WhatsApp
          </a>
          <button onClick={() => document.getElementById(firstCatId)?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 border-2 border-[#F5F5F5] text-[#F5F5F5] px-8 py-4 font-condensed font-bold text-lg uppercase tracking-widest hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-all">
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

function GrungeDivider() {
  return (
    <div className="flex items-center gap-0 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex-1 h-px bg-[#2A2A2A]" />
      <div className="w-2 h-2 bg-[#E8151B] rotate-45 mx-3" />
      <div className="flex-1 h-px bg-[#2A2A2A]" />
    </div>
  );
}

function PublicFooter({ wa, onAdminClick }: { wa: string; onAdminClick: () => void }) {
  return (
    <footer className="border-t border-[#2A2A2A] py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <Logo size="sm" />
        <div className="text-center md:text-right">
          <p className="font-condensed text-[#888] text-sm uppercase tracking-widest">
            Preguntas y pedidos por WhatsApp
          </p>
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center md:justify-end mt-2 text-[#25D366] font-condensed font-bold text-base tracking-wide hover:text-[#20C05A] transition-colors">
            <WAIcon size={16} />
            +{wa}
          </a>
          <p className="font-condensed text-[#444] text-xs uppercase tracking-widest mt-4">
            © {new Date().getFullYear()} URB&amp;STREET — Real Style. Everyday.
          </p>
          <button onClick={onAdminClick}
            className="mt-4 font-condensed text-[#2A2A2A] text-xs uppercase tracking-widest hover:text-[#555] transition-colors">
            ⚙ Admin
          </button>
        </div>
      </div>
    </footer>
  );
}

function FloatingWA({ wa }: { wa: string }) {
  return (
    <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
      className="wa-float fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform active:scale-95"
      aria-label="WhatsApp">
      <WAIcon size={28} />
    </a>
  );
}

function PublicLanding({ cats, wa, onAdminClick }: { cats: Category[]; wa: string; onAdminClick: () => void }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <PublicHeader cats={cats} wa={wa} />
      <Hero firstCatId={cats[0]?.id ?? "gorras"} wa={wa} />
      <main>
        {cats.map((cat, i) => (
          <div key={cat.id}>
            <CategorySection category={cat} wa={wa} />
            {i < cats.length - 1 && <GrungeDivider />}
          </div>
        ))}
      </main>
      <div className="bg-[#25D366] py-4">
        <a href={waLink(wa)} target="_blank" rel="noopener noreferrer"
          className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 text-[#0A0A0A] font-condensed font-black text-lg md:text-xl uppercase tracking-widest hover:opacity-80 transition-opacity">
          <WAIcon size={24} />
          ¿Listo para pedir? Escríbenos ahora por WhatsApp →
        </a>
      </div>
      <PublicFooter wa={wa} onAdminClick={onAdminClick} />
      <FloatingWA wa={wa} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN VIEW
// ─────────────────────────────────────────────────────────────────────────────

function AdminLogin({
  onLogin, onCancel,
}: { onLogin: () => void; onCancel: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onLogin();
    } else {
      setErr(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-8">
          <h2 className="font-condensed font-black text-2xl uppercase tracking-widest text-[#F5F5F5] mb-1">
            Panel Admin
          </h2>
          <p className="font-condensed text-[#555] text-sm uppercase tracking-widest mb-8">
            Acceso restringido
          </p>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="font-condensed text-xs uppercase tracking-widest text-[#888] block mb-1">
                Usuario
              </label>
              <input type="text" value={user} onChange={(e) => { setUser(e.target.value); setErr(false); }}
                className="w-full bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5] font-condensed text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8151B] transition-colors"
                autoComplete="username" />
            </div>
            <div>
              <label className="font-condensed text-xs uppercase tracking-widest text-[#888] block mb-1">
                Contraseña
              </label>
              <input type="password" value={pass} onChange={(e) => { setPass(e.target.value); setErr(false); }}
                className="w-full bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5] font-condensed text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8151B] transition-colors"
                autoComplete="current-password" />
            </div>
            {err && (
              <p className="font-condensed text-[#E8151B] text-xs uppercase tracking-widest">
                Credenciales incorrectas
              </p>
            )}
            <button type="submit"
              className="w-full bg-[#E8151B] text-[#F5F5F5] font-condensed font-black text-sm uppercase tracking-widest py-3 hover:bg-[#FF2020] transition-colors mt-2">
              Entrar
            </button>
          </form>
          <button onClick={onCancel}
            className="w-full mt-4 font-condensed text-[#444] text-xs uppercase tracking-widest hover:text-[#888] transition-colors py-2">
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
}

type AdminSection = "overview" | "category" | "settings";

function AddProductModal({
  onAdd, onClose,
}: { onAdd: (name: string, img: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), img.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-condensed font-black text-xl uppercase tracking-widest text-[#F5F5F5]">
            Agregar producto
          </h3>
          <button onClick={onClose} className="text-[#555] hover:text-[#F5F5F5] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="font-condensed text-xs uppercase tracking-widest text-[#888] block mb-1">
              Nombre / Estilo *
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="Ej: Jogger Premium Azul"
              className="w-full bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5] font-condensed text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8151B] transition-colors placeholder-[#444]" />
          </div>
          <div>
            <label className="font-condensed text-xs uppercase tracking-widest text-[#888] block mb-1">
              URL de imagen (opcional)
            </label>
            <input type="url" value={img} onChange={(e) => setImg(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5] font-condensed text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8151B] transition-colors placeholder-[#444]" />
            <p className="font-condensed text-[#444] text-xs mt-1">
              Si no pones imagen, se usará un placeholder.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-[#2A2A2A] text-[#888] font-condensed font-bold text-sm uppercase tracking-widest py-2.5 hover:border-[#555] transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 bg-[#25D366] text-[#0A0A0A] font-condensed font-black text-sm uppercase tracking-widest py-2.5 hover:bg-[#20C05A] transition-colors">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminCategoryView({
  category, onBack, onToggle, onDelete, onAdd,
}: {
  category: Category;
  onBack: () => void;
  onToggle: (productId: string) => void;
  onDelete: (productId: string) => void;
  onAdd: (name: string, img: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const visible = category.products.filter((p) => p.visible).length;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack}
          className="text-[#888] hover:text-[#F5F5F5] transition-colors flex items-center gap-2 font-condensed text-sm uppercase tracking-widest">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Volver
        </button>
        <div className="w-1 h-8 bg-[#E8151B]" />
        <h2 className="font-condensed font-black text-3xl uppercase tracking-widest text-[#F5F5F5]">
          {category.label}
        </h2>
        {category.comingSoon && (
          <span className="font-condensed text-xs text-[#E8151B] border border-[#E8151B] px-2 py-0.5 uppercase tracking-widest">
            Próximamente
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="font-condensed text-[#888] text-sm uppercase tracking-widest">
          {category.products.length} productos — {visible} visibles
        </p>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#E8151B] text-[#F5F5F5] font-condensed font-black text-sm uppercase tracking-widest px-4 py-2 hover:bg-[#FF2020] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar
        </button>
      </div>

      {category.products.length === 0 ? (
        <div className="border border-dashed border-[#2A2A2A] py-16 flex flex-col items-center gap-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
          <p className="font-condensed text-[#444] text-sm uppercase tracking-widest">
            Sin productos — agrega el primero
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {category.products.map((p) => (
            <div key={p.id}
              className={`flex items-center gap-4 p-3 border transition-colors ${
                p.visible ? "border-[#2A2A2A] bg-[#0F0F0F]" : "border-[#1A1A1A] bg-[#080808] opacity-50"
              }`}>
              <div className="w-12 h-12 bg-[#1A1A1A] overflow-hidden flex-none">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-condensed font-bold text-sm uppercase tracking-wider text-[#F5F5F5] flex-1">
                {p.name}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => onToggle(p.id)}
                  className={`font-condensed text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                    p.visible
                      ? "border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-[#0A0A0A]"
                      : "border-[#555] text-[#555] hover:border-[#888] hover:text-[#888]"
                  }`}>
                  {p.visible ? "Visible" : "Oculto"}
                </button>
                <button onClick={() => onDelete(p.id)}
                  className="text-[#333] hover:text-[#E8151B] transition-colors p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddProductModal
          onAdd={(name, img) => { onAdd(name, img); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

function AdminOverview({
  cats, onSelectCat,
}: { cats: Category[]; onSelectCat: (id: string) => void }) {
  return (
    <div>
      <h2 className="font-condensed font-black text-3xl uppercase tracking-widest text-[#F5F5F5] mb-2">
        Resumen del catálogo
      </h2>
      <p className="font-condensed text-[#555] text-sm uppercase tracking-widest mb-8">
        {cats.reduce((a, c) => a + c.products.filter(p => p.visible).length, 0)} productos visibles en total
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((cat) => {
          const total = cat.products.length;
          const vis = cat.products.filter((p) => p.visible).length;
          const pct = total === 0 ? 0 : Math.round((vis / total) * 100);
          return (
            <button key={cat.id} onClick={() => onSelectCat(cat.id)}
              className="text-left bg-[#0F0F0F] border border-[#2A2A2A] p-5 hover:border-[#E8151B] transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#E8151B]" />
                  <h3 className="font-condensed font-black text-lg uppercase tracking-widest text-[#F5F5F5]">
                    {cat.label}
                  </h3>
                </div>
                {cat.comingSoon && (
                  <span className="font-condensed text-[10px] text-[#E8151B] border border-[#E8151B] px-1.5 py-0.5 uppercase tracking-widest">
                    Pronto
                  </span>
                )}
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-condensed text-xs text-[#888] uppercase tracking-widest">
                    {vis}/{total} visibles
                  </span>
                  <span className="font-condensed text-xs text-[#888]">{pct}%</span>
                </div>
                <div className="h-1 bg-[#1A1A1A] w-full">
                  <div className="h-full bg-[#E8151B] transition-all duration-300"
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
              <p className="font-condensed text-xs text-[#555] uppercase tracking-widest group-hover:text-[#E8151B] transition-colors">
                Gestionar →
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AdminSettings({
  wa, onSaveWa,
}: { wa: string; onSaveWa: (n: string) => void }) {
  const [val, setVal] = useState(wa);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWa(val.replace(/\D/g, ""));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="font-condensed font-black text-3xl uppercase tracking-widest text-[#F5F5F5] mb-2">
        Ajustes
      </h2>
      <p className="font-condensed text-[#555] text-sm uppercase tracking-widest mb-8">
        Configuración global de la tienda
      </p>
      <div className="max-w-md">
        <form onSubmit={save} className="bg-[#0F0F0F] border border-[#2A2A2A] p-6">
          <h3 className="font-condensed font-black text-base uppercase tracking-widest text-[#F5F5F5] mb-5">
            Número de WhatsApp
          </h3>
          <label className="font-condensed text-xs uppercase tracking-widest text-[#888] block mb-1">
            Número (solo dígitos, con código de país)
          </label>
          <input type="tel" value={val} onChange={(e) => { setVal(e.target.value); setSaved(false); }}
            placeholder="573001234567"
            className="w-full bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5] font-condensed text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8151B] transition-colors mb-1" />
          <p className="font-condensed text-[#444] text-xs mb-5">
            Ejemplo Colombia: 573001234567 (sin + ni espacios)
          </p>
          <button type="submit"
            className={`w-full font-condensed font-black text-sm uppercase tracking-widest py-3 transition-all ${
              saved ? "bg-[#25D366] text-[#0A0A0A]" : "bg-[#E8151B] text-[#F5F5F5] hover:bg-[#FF2020]"
            }`}>
            {saved ? "¡Guardado!" : "Guardar número"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminPanel({
  cats, wa, onCatsChange, onWaChange, onExit,
}: {
  cats: Category[];
  wa: string;
  onCatsChange: (c: Category[]) => void;
  onWaChange: (n: string) => void;
  onExit: () => void;
}) {
  const [section, setSection] = useState<AdminSection>("overview");
  const [activeCatId, setActiveCatId] = useState<string | null>(null);

  const activeCat = cats.find((c) => c.id === activeCatId) ?? null;

  const toggleProduct = (catId: string, prodId: string) => {
    onCatsChange(cats.map((c) =>
      c.id !== catId ? c : {
        ...c,
        products: c.products.map((p) =>
          p.id !== prodId ? p : { ...p, visible: !p.visible }
        ),
      }
    ));
  };

  const deleteProduct = (catId: string, prodId: string) => {
    onCatsChange(cats.map((c) =>
      c.id !== catId ? c : { ...c, products: c.products.filter((p) => p.id !== prodId) }
    ));
  };

  const addProduct = (catId: string, name: string, img: string) => {
    const fallback = U("1525966222134-fcfa99b8ae77");
    onCatsChange(cats.map((c) =>
      c.id !== catId ? c : {
        ...c,
        comingSoon: false,
        products: [
          ...c.products,
          { id: `new-${Date.now()}`, name, img: img || fallback, visible: true },
        ],
      }
    ));
  };

  const navItems: { id: AdminSection; label: string }[] = [
    { id: "overview", label: "Resumen" },
    { id: "settings", label: "Ajustes" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0F0F0F] border-b border-[#2A2A2A] px-4 md:px-8 h-14 flex items-center justify-between flex-none">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="font-condensed text-xs text-[#555] uppercase tracking-[0.3em] hidden sm:block">
            Panel Administrador
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onExit}
            className="flex items-center gap-2 border border-[#25D366] text-[#25D366] font-condensed font-bold text-xs uppercase tracking-widest px-3 py-1.5 hover:bg-[#25D366] hover:text-[#0A0A0A] transition-colors">
            <WAIcon size={12} />
            Ver tienda
          </button>
          <button onClick={onExit}
            className="font-condensed text-xs text-[#555] uppercase tracking-widest hover:text-[#E8151B] transition-colors px-2 py-1.5">
            Salir
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-[#0A0A0A] border-r border-[#1A1A1A] flex-none hidden md:flex flex-col overflow-y-auto py-6">
          <div className="px-4 mb-2">
            <p className="font-condensed text-[10px] text-[#333] uppercase tracking-[0.3em] mb-3">General</p>
            {navItems.map((n) => (
              <button key={n.id} onClick={() => { setSection(n.id); setActiveCatId(null); }}
                className={`w-full text-left font-condensed font-bold text-sm uppercase tracking-widest px-3 py-2.5 mb-1 transition-colors ${
                  section === n.id && !activeCatId
                    ? "bg-[#E8151B] text-[#F5F5F5]"
                    : "text-[#888] hover:text-[#F5F5F5] hover:bg-[#141414]"
                }`}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="px-4 mt-4">
            <p className="font-condensed text-[10px] text-[#333] uppercase tracking-[0.3em] mb-3">Categorías</p>
            {cats.map((c) => {
              const vis = c.products.filter((p) => p.visible).length;
              return (
                <button key={c.id}
                  onClick={() => { setSection("category" as AdminSection); setActiveCatId(c.id); }}
                  className={`w-full text-left font-condensed text-xs uppercase tracking-widest px-3 py-2 mb-0.5 transition-colors flex items-center justify-between gap-2 ${
                    activeCatId === c.id
                      ? "bg-[#141414] text-[#F5F5F5] border-l-2 border-[#E8151B]"
                      : "text-[#555] hover:text-[#888] hover:bg-[#0D0D0D]"
                  }`}>
                  <span className="truncate">{c.label}</span>
                  <span className={`text-[10px] font-condensed flex-none ${c.comingSoon ? "text-[#E8151B]" : "text-[#444]"}`}>
                    {c.comingSoon ? "—" : vis}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Mobile category tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-6">
            {navItems.map((n) => (
              <button key={n.id} onClick={() => { setSection(n.id); setActiveCatId(null); }}
                className={`flex-none font-condensed text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                  section === n.id && !activeCatId ? "bg-[#E8151B] border-[#E8151B] text-white" : "border-[#2A2A2A] text-[#888]"
                }`}>
                {n.label}
              </button>
            ))}
            {cats.map((c) => (
              <button key={c.id}
                onClick={() => { setSection("category" as AdminSection); setActiveCatId(c.id); }}
                className={`flex-none font-condensed text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                  activeCatId === c.id ? "bg-[#141414] border-[#E8151B] text-[#F5F5F5]" : "border-[#2A2A2A] text-[#555]"
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          {section === "overview" && !activeCatId && (
            <AdminOverview cats={cats} onSelectCat={(id) => { setSection("category" as AdminSection); setActiveCatId(id); }} />
          )}
          {section === "settings" && !activeCatId && (
            <AdminSettings wa={wa} onSaveWa={onWaChange} />
          )}
          {activeCatId && activeCat && (
            <AdminCategoryView
              category={activeCat}
              onBack={() => { setActiveCatId(null); setSection("overview"); }}
              onToggle={(pid) => toggleProduct(activeCatId, pid)}
              onDelete={(pid) => deleteProduct(activeCatId, pid)}
              onAdd={(name, img) => addProduct(activeCatId, name, img)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [cats, setCats] = useState<Category[]>(INIT_CATS);
  const [wa, setWa] = useState(WA_DEFAULT);
  const [mode, setMode] = useState<"public" | "login" | "admin">("public");

  if (mode === "login") {
    return (
      <AdminLogin
        onLogin={() => setMode("admin")}
        onCancel={() => setMode("public")}
      />
    );
  }
  if (mode === "admin") {
    return (
      <AdminPanel
        cats={cats}
        wa={wa}
        onCatsChange={setCats}
        onWaChange={setWa}
        onExit={() => setMode("public")}
      />
    );
  }
  return (
    <PublicLanding
      cats={cats}
      wa={wa}
      onAdminClick={() => setMode("login")}
    />
  );
}
