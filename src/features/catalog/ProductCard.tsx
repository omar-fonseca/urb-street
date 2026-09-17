import { useEffect, useRef, useState } from "react";
import { WAIcon } from "@/components/Brand";
import { waLink } from "@/features/whatsapp/waLink";
import type { Product } from "@/types/catalog";

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onAddImage?: (product: Product, file: File) => void;
  onDeleteImage?: (product: Product, imageId: string) => void;
}

export function ProductCard({
  product,
  isAdmin = false,
  onAddImage,
  onDeleteImage,
}: ProductCardProps) {
  const primary = product.images?.[0];
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const hasImage = Boolean(primary?.public_url);

  return (
    <div
      className="product-card flex-none w-64 md:w-72 bg-[#141414] border border-[#2A2A2A] overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative overflow-hidden bg-[#1A1A1A] aspect-[4/5]">
        {hasImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[#1E1E1E]" aria-hidden />
            )}
            <img
              src={primary!.public_url}
              alt={product.nombre}
              width={600}
              height={750}
              className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 border border-dashed border-[#2A2A2A]">
            <span className="font-condensed text-[#444] text-xs uppercase tracking-widest">
              Sin foto aún
            </span>
          </div>
        )}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[48px] border-t-[#E8151B] border-r-[48px] border-r-transparent" />

        {isAdmin && (
          <div className="absolute top-2 right-2 z-20" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 bg-black/70 text-[#F5F5F5] flex items-center justify-center hover:bg-black/90"
              aria-label="Menú de imagen"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-[#0F0F0F] border border-[#2A2A2A] shadow-xl">
                {hasImage ? (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2.5 font-condensed text-sm uppercase tracking-widest text-[#E8151B] hover:bg-[#1A1A1A]"
                    onClick={() => {
                      setMenuOpen(false);
                      if (primary && onDeleteImage) {
                        if (window.confirm("¿Eliminar esta imagen?")) {
                          onDeleteImage(product, primary.id);
                        }
                      }
                    }}
                  >
                    Eliminar imagen
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2.5 font-condensed text-sm uppercase tracking-widest text-[#F5F5F5] hover:bg-[#1A1A1A]"
                    onClick={() => {
                      setMenuOpen(false);
                      fileRef.current?.click();
                    }}
                  >
                    Agregar imagen
                  </button>
                )}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file && onAddImage) onAddImage(product, file);
              }}
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-condensed text-base font-bold uppercase tracking-wider text-[#F5F5F5] leading-tight mb-3">
          {product.nombre}
        </p>
        <a
          href={waLink(product.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-[#0A0A0A] font-condensed font-black text-sm uppercase tracking-widest transition-all duration-200 hover:bg-[#20C05A] active:scale-95"
        >
          <WAIcon size={16} />
          Preguntar
        </a>
      </div>
    </div>
  );
}
