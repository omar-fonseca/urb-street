import { getSupabase, isSupabaseConfigured } from "@/services/supabase/client";
import type { CatalogCategory, Category, Product, ProductImage } from "@/types/catalog";

export class CatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogError";
  }
}

export async function fetchCatalog(): Promise<CatalogCategory[]> {
  if (!isSupabaseConfigured) {
    throw new CatalogError(
      "Catálogo no disponible: falta configuración de Supabase."
    );
  }

  const supabase = getSupabase();

  const { data: categories, error: catErr } = await supabase
    .from("categorias")
    .select("id, nombre, slug, orden, activo, created_at")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (catErr) throw new CatalogError(catErr.message);
  if (!categories?.length) return [];

  const { data: products, error: prodErr } = await supabase
    .from("productos")
    .select("id, categoria_id, nombre, orden, visible, created_at, updated_at")
    .eq("visible", true)
    .order("orden", { ascending: true });

  if (prodErr) throw new CatalogError(prodErr.message);

  const productIds = (products ?? []).map((p) => p.id);
  let images: ProductImage[] = [];

  if (productIds.length > 0) {
    const { data: imgs, error: imgErr } = await supabase
      .from("producto_imagenes")
      .select("id, producto_id, storage_path, public_url, orden, created_at")
      .in("producto_id", productIds)
      .order("orden", { ascending: true });

    if (imgErr) throw new CatalogError(imgErr.message);
    images = (imgs ?? []) as ProductImage[];
  }

  const imagesByProduct = new Map<string, ProductImage[]>();
  for (const img of images) {
    const list = imagesByProduct.get(img.producto_id) ?? [];
    list.push(img);
    imagesByProduct.set(img.producto_id, list);
  }

  const productsByCat = new Map<string, Product[]>();
  for (const p of (products ?? []) as Product[]) {
    const withImages: Product = {
      ...p,
      images: imagesByProduct.get(p.id) ?? [],
    };
    const list = productsByCat.get(p.categoria_id) ?? [];
    list.push(withImages);
    productsByCat.set(p.categoria_id, list);
  }

  return (categories as Category[]).map((cat) => ({
    ...cat,
    products: productsByCat.get(cat.id) ?? [],
  }));
}

/** Admin: include hidden products */
export async function fetchCatalogAdmin(): Promise<CatalogCategory[]> {
  if (!isSupabaseConfigured) {
    throw new CatalogError(
      "Catálogo no disponible: falta configuración de Supabase."
    );
  }

  const supabase = getSupabase();

  const { data: categories, error: catErr } = await supabase
    .from("categorias")
    .select("id, nombre, slug, orden, activo, created_at")
    .order("orden", { ascending: true });

  if (catErr) throw new CatalogError(catErr.message);
  if (!categories?.length) return [];

  const { data: products, error: prodErr } = await supabase
    .from("productos")
    .select("id, categoria_id, nombre, orden, visible, created_at, updated_at")
    .order("orden", { ascending: true });

  if (prodErr) throw new CatalogError(prodErr.message);

  const productIds = (products ?? []).map((p) => p.id);
  let images: ProductImage[] = [];

  if (productIds.length > 0) {
    const { data: imgs, error: imgErr } = await supabase
      .from("producto_imagenes")
      .select("id, producto_id, storage_path, public_url, orden, created_at")
      .in("producto_id", productIds)
      .order("orden", { ascending: true });

    if (imgErr) throw new CatalogError(imgErr.message);
    images = (imgs ?? []) as ProductImage[];
  }

  const imagesByProduct = new Map<string, ProductImage[]>();
  for (const img of images) {
    const list = imagesByProduct.get(img.producto_id) ?? [];
    list.push(img);
    imagesByProduct.set(img.producto_id, list);
  }

  const productsByCat = new Map<string, Product[]>();
  for (const p of (products ?? []) as Product[]) {
    const withImages: Product = {
      ...p,
      images: imagesByProduct.get(p.id) ?? [],
    };
    const list = productsByCat.get(p.categoria_id) ?? [];
    list.push(withImages);
    productsByCat.set(p.categoria_id, list);
  }

  return (categories as Category[]).map((cat) => ({
    ...cat,
    products: productsByCat.get(cat.id) ?? [],
  }));
}
