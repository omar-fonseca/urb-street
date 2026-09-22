/** Short product reference shown on cards and in WhatsApp. */
export const PRODUCT_REF_MAX = 50;

const FALLBACK_BY_SLUG: Record<string, string> = {
  gorras: "Gorra",
  camisetas: "Camiseta",
  pantalones: "Pantalón",
  conjuntos: "Conjunto",
  pantalonetas: "Pantaloneta",
  zapatos: "Zapato",
  accesorios: "Accesorio",
};

export function defaultProductRef(categorySlug: string): string {
  return FALLBACK_BY_SLUG[categorySlug] ?? "Producto";
}

/**
 * Normalize a product reference for storage.
 * Empty input → fallback. Over length → error via return shape.
 */
export function normalizeProductRef(
  input: string | null | undefined,
  categorySlug: string
): { ok: true; value: string } | { ok: false; error: string } {
  const cleaned = (input ?? "").trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return { ok: true, value: defaultProductRef(categorySlug) };
  }
  if (cleaned.length > PRODUCT_REF_MAX) {
    return {
      ok: false,
      error: `Máximo ${PRODUCT_REF_MAX} caracteres (ej. Camisa oversize talla L).`,
    };
  }
  return { ok: true, value: cleaned };
}
