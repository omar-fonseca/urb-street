/**
 * One-image vertical validation (local only).
 * Does NOT import the mass catalog.
 *
 * Requires in .env (gitignored, NO VITE_ prefix):
 *   ADMIN_EMAIL=
 *   ADMIN_PASSWORD=
 *   VITE_SUPABASE_URL=
 *   VITE_SUPABASE_PUBLISHABLE_KEY=
 *
 * Usage: node scripts/validate-one-image.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!existsSync(envPath)) throw new Error(".env missing");
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(k in process.env) || !process.env[k]) process.env[k] = v;
  }
}

function pickSmallImage() {
  const candidates = [
    path.join(root, "images", "Pantalonetas", "Bermudas de jean", "IMG-20250627-WA1922.jpg"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error("No test image found under images/");
}

async function main() {
  loadEnv();
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL or PUBLISHABLE_KEY");
  if (!email || !password) {
    throw new Error(
      "Add ADMIN_EMAIL and ADMIN_PASSWORD to .env (local only, not VITE_) then re-run"
    );
  }

  const sb = createClient(url, key);
  console.log("1) login…");
  const { data: auth, error: authErr } = await sb.auth.signInWithPassword({
    email,
    password,
  });
  if (authErr || !auth.session) throw new Error(authErr?.message ?? "login failed");
  console.log("   OK");

  console.log("2) load category gorras…");
  const { data: cat, error: catErr } = await sb
    .from("categorias")
    .select("id, slug, nombre")
    .eq("slug", "gorras")
    .single();
  if (catErr || !cat) throw new Error(catErr?.message ?? "gorras missing");

  const imgPath = pickSmallImage();
  const bytes = readFileSync(imgPath);
  const productId = crypto.randomUUID();
  const storagePath = `${cat.slug}/${productId}/probe.jpg`;
  const { data: pub } = sb.storage.from("product-images").getPublicUrl(storagePath);

  console.log("3) create product…");
  // Compat: schema actual exige url_imagen NOT NULL + check URL
  const { data: product, error: pErr } = await sb
    .from("productos")
    .insert({
      id: productId,
      categoria_id: cat.id,
      nombre: "Prueba V1 #001",
      orden: 9999,
      visible: true,
      url_imagen: pub.publicUrl,
    })
    .select("id")
    .single();
  if (pErr || !product) throw new Error(pErr?.message ?? "product insert failed");

  console.log("4) upload storage…");
  const { error: upErr } = await sb.storage.from("product-images").upload(storagePath, bytes, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (upErr) {
    await sb.from("productos").delete().eq("id", product.id);
    throw new Error("upload: " + upErr.message);
  }

  console.log("5) insert producto_imagenes…");
  const { data: row, error: iErr } = await sb
    .from("producto_imagenes")
    .insert({
      producto_id: product.id,
      storage_path: storagePath,
      public_url: pub.publicUrl,
      orden: 1,
    })
    .select("id")
    .single();
  if (iErr || !row) {
    await sb.storage.from("product-images").remove([storagePath]);
    await sb.from("productos").delete().eq("id", product.id);
    throw new Error("image row: " + (iErr?.message ?? "missing"));
  }

  console.log("6) verify public read…");
  const anon = createClient(url, key);
  const { data: pubRows, error: pubErr } = await anon
    .from("producto_imagenes")
    .select("id, public_url")
    .eq("id", row.id);
  if (pubErr) throw new Error("public read: " + pubErr.message);
  if (!pubRows?.length) throw new Error("buyer cannot see image row");
  console.log("   public_url ok");

  console.log("7) delete image + storage + product…");
  const { error: rmFile } = await sb.storage.from("product-images").remove([storagePath]);
  if (rmFile) throw new Error("storage delete: " + rmFile.message);
  const { error: rmRow } = await sb.from("producto_imagenes").delete().eq("id", row.id);
  if (rmRow) throw new Error("row delete: " + rmRow.message);
  const { error: rmProd } = await sb.from("productos").delete().eq("id", product.id);
  if (rmProd) throw new Error("product delete: " + rmProd.message);

  const { data: left } = await sb
    .from("producto_imagenes")
    .select("id")
    .eq("id", row.id);
  const { data: listed } = await sb.storage
    .from("product-images")
    .list(`${cat.slug}/${product.id}`);
  console.log(
    "8) leftovers image rows=",
    left?.length ?? 0,
    "storage objs=",
    listed?.length ?? 0
  );
  if ((left?.length ?? 0) > 0 || (listed?.length ?? 0) > 0) {
    throw new Error("orphans remain after cleanup");
  }

  await sb.auth.signOut();
  console.log("\nPASS vertical one-image flow");
}

main().catch((e) => {
  console.error("\nFAIL", e.message ?? e);
  process.exit(1);
});
