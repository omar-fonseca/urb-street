import { getSupabase } from "@/services/supabase/client";
import {
  deleteProductImage,
  uploadProductImage,
} from "@/services/storage/storageService";
import { optimizeImageFile } from "@/lib/imageOptimize";

export async function addImageToProduct(
  productId: string,
  categorySlug: string,
  file: File
): Promise<void> {
  const supabase = getSupabase();
  const optimized = await optimizeImageFile(file);
  const id = crypto.randomUUID();
  const storagePath = `${categorySlug}/${productId}/${id}.webp`;

  const publicUrl = await uploadProductImage(
    storagePath,
    optimized.blob,
    "image/webp"
  );

  const { data: existing } = await supabase
    .from("producto_imagenes")
    .select("orden")
    .eq("producto_id", productId)
    .order("orden", { ascending: false })
    .limit(1);

  const nextOrden = (existing?.[0]?.orden ?? 0) + 1;

  const { error } = await supabase.from("producto_imagenes").insert({
    producto_id: productId,
    storage_path: storagePath,
    public_url: publicUrl,
    orden: nextOrden,
  });

  if (error) {
    await deleteProductImage(storagePath).catch(() => undefined);
    throw new Error(error.message);
  }
}

export async function createProductWithImage(
  categoriaId: string,
  categorySlug: string,
  file: File,
  nombre: string
): Promise<void> {
  const supabase = getSupabase();

  const { data: maxOrden } = await supabase
    .from("productos")
    .select("orden")
    .eq("categoria_id", categoriaId)
    .order("orden", { ascending: false })
    .limit(1);

  const orden = (maxOrden?.[0]?.orden ?? 0) + 1;

  const { data: product, error: prodErr } = await supabase
    .from("productos")
    .insert({
      categoria_id: categoriaId,
      nombre,
      orden,
      visible: true,
    })
    .select("id")
    .single();

  if (prodErr || !product) throw new Error(prodErr?.message ?? "No se creó el producto");

  try {
    await addImageToProduct(product.id, categorySlug, file);
  } catch (err) {
    await supabase.from("productos").delete().eq("id", product.id);
    throw err;
  }
}

export async function removeImage(imageId: string): Promise<void> {
  const supabase = getSupabase();

  const { data: image, error: fetchErr } = await supabase
    .from("producto_imagenes")
    .select("id, storage_path, producto_id")
    .eq("id", imageId)
    .single();

  if (fetchErr || !image) throw new Error(fetchErr?.message ?? "Imagen no encontrada");

  await deleteProductImage(image.storage_path);

  const { error: delErr } = await supabase
    .from("producto_imagenes")
    .delete()
    .eq("id", imageId);

  if (delErr) throw new Error(delErr.message);

  const { count } = await supabase
    .from("producto_imagenes")
    .select("id", { count: "exact", head: true })
    .eq("producto_id", image.producto_id);

  if (count === 0) {
    await supabase.from("productos").delete().eq("id", image.producto_id);
  }
}
