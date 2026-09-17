/** Official V1 categories — fixed order */
export const OFFICIAL_CATEGORIES = [
  { slug: "gorras", nombre: "Gorras", orden: 1 },
  { slug: "camisetas", nombre: "Camisetas", orden: 2 },
  { slug: "pantalones", nombre: "Pantalones", orden: 3 },
  { slug: "conjuntos", nombre: "Conjuntos", orden: 4 },
  { slug: "pantalonetas", nombre: "Pantalonetas", orden: 5 },
  { slug: "zapatos", nombre: "Zapatos", orden: 6 },
  { slug: "accesorios", nombre: "Accesorios", orden: 7 },
] as const;

export type CategorySlug = (typeof OFFICIAL_CATEGORIES)[number]["slug"];

export interface Category {
  id: string;
  nombre: string;
  slug: CategorySlug | string;
  orden: number;
  activo: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  producto_id: string;
  storage_path: string;
  public_url: string;
  orden: number;
  created_at: string;
}

export interface Product {
  id: string;
  categoria_id: string;
  nombre: string;
  orden: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface CatalogCategory extends Category {
  products: Product[];
}

export type AsyncStatus = "idle" | "loading" | "success" | "empty" | "error";

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}
