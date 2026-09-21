import { WAIcon } from "@/components/Brand";
import { Carousel } from "@/features/catalog/Carousel";
import { ProductCard } from "@/features/catalog/ProductCard";
import { waCategoryLink } from "@/features/whatsapp/waLink";
import type { CatalogCategory, Product } from "@/types/catalog";

interface CategorySectionProps {
  category: CatalogCategory;
  isAdmin?: boolean;
  onAddImage?: (product: Product, file: File) => void;
  onDeleteImage?: (product: Product, imageId: string) => void;
  onRename?: (product: Product, nombre: string) => void;
  onAddProductImage?: (category: CatalogCategory, file: File) => void;
}

export function CategorySection({
  category,
  isAdmin = false,
  onAddImage,
  onDeleteImage,
  onRename,
  onAddProductImage,
}: CategorySectionProps) {
  const products = isAdmin
    ? category.products
    : category.products.filter((p) => p.visible && (p.images?.length ?? 0) > 0);

  const fileRefId = `add-${category.slug}`;

  return (
    <section id={category.slug} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-10 bg-[#E8151B]" />
          <h2 className="font-condensed font-black text-4xl md:text-5xl uppercase tracking-widest text-[#F5F5F5]">
            {category.nombre}
          </h2>
          <div className="flex-1 h-px bg-[#2A2A2A] ml-2" />
          <span className="font-condensed text-xs text-[#555] uppercase tracking-widest">
            {products.length} {products.length === 1 ? "estilo" : "estilos"}
          </span>
          {isAdmin && onAddProductImage && (
            <>
              <input
                id={fileRefId}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) onAddProductImage(category, file);
                }}
              />
              <label
                htmlFor={fileRefId}
                className="cursor-pointer font-condensed text-xs uppercase tracking-widest border border-[#E8151B] text-[#E8151B] px-3 py-1.5 hover:bg-[#E8151B] hover:text-white transition-colors"
              >
                + Imagen
              </label>
            </>
          )}
        </div>
        <div className="px-6 md:px-8">
          <Carousel autoplay={!isAdmin && products.length > 1} emptyLabel="Sin fotografías en esta categoría">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isAdmin={isAdmin}
                onAddImage={onAddImage}
                onDeleteImage={onDeleteImage}
                onRename={onRename}
              />
            ))}
          </Carousel>
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href={waCategoryLink(category.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#888] font-condensed font-semibold text-sm uppercase tracking-widest hover:text-[#25D366] transition-colors"
          >
            <WAIcon size={14} />
            Ver más {category.nombre.toLowerCase()} →
          </a>
        </div>
      </div>
    </section>
  );
}

export function GrungeDivider() {
  return (
    <div className="flex items-center gap-0 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex-1 h-px bg-[#2A2A2A]" />
      <div className="w-2 h-2 bg-[#E8151B] rotate-45 mx-3" />
      <div className="flex-1 h-px bg-[#2A2A2A]" />
    </div>
  );
}
