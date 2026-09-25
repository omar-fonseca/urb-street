/**
 * Bulk image importer for URB Street V1.
 *
 * Flow: scan → validate → category detect → optimize WebP → Storage → PostgreSQL
 *
 * Usage:
 *   set SUPABASE_URL=...
 *   set SUPABASE_SERVICE_ROLE_KEY=...   (local only — never commit)
 *   npm run import:images
 *
 * Optional:
 *   IMPORT_ROOT=./images
 *   IMPORT_DRY_RUN=1
 *   IMPORT_MAX_WIDTH=1200
 *   IMPORT_QUALITY=82
 *   IMPORT_MAX_INPUT_MB=15
 *   IMPORT_BATCH_SIZE=20
 */

import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BUCKET = "product-images";
const ROOT = path.resolve(process.env.IMPORT_ROOT ?? "images");
const DRY = process.env.IMPORT_DRY_RUN === "1";
const MAX_W = Number(process.env.IMPORT_MAX_WIDTH ?? 1200);
const MAX_H = Number(process.env.IMPORT_MAX_HEIGHT ?? 1500);
const QUALITY = Number(process.env.IMPORT_QUALITY ?? 82);
const MAX_INPUT = Number(process.env.IMPORT_MAX_INPUT_MB ?? 15) * 1024 * 1024;
const BATCH = Number(process.env.IMPORT_BATCH_SIZE ?? 20);

const FOLDER_TO_SLUG: Record<string, string> = {
  gorras: "gorras",
  "gorras 1.1": "gorras",
  camisetas: "camisetas",
  pantalones: "pantalones",
  conjuntos: "conjuntos",
  pantalonetas: "pantalonetas",
  bermudas: "bermudas",
  zapatos: "zapatos",
  accesorios: "accesorios",
};

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

interface ReportError {
  archivo: string;
  categoria: string;
  motivo: string;
  solucion: string;
}

interface Report {
  encontradas: number;
  validas: number;
  procesadas: number;
  subidas: number;
  rechazadas: number;
  errores: ReportError[];
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno ${name}`);
  return v;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function detectCategory(filePath: string): string | null {
  const rel = path.relative(ROOT, filePath);
  const top = rel.split(path.sep)[0]?.toLowerCase() ?? "";
  return FOLDER_TO_SLUG[top] ?? null;
}

function contentHash(buf: Buffer): string {
  return createHash("sha1").update(buf).digest("hex").slice(0, 16);
}

async function main() {
  const report: Report = {
    encontradas: 0,
    validas: 0,
    procesadas: 0,
    subidas: 0,
    rechazadas: 0,
    errores: [],
  };

  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: cats, error: catErr } = await supabase
    .from("categorias")
    .select("id, slug, nombre");
  if (catErr) throw catErr;

  const catBySlug = new Map((cats ?? []).map((c) => [c.slug, c]));
  const counters = new Map<string, number>();

  const files = await walk(ROOT);
  report.encontradas = files.length;

  const valid: { file: string; slug: string }[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const slug = detectCategory(file);
    if (!slug) {
      report.rechazadas++;
      report.errores.push({
        archivo: file,
        categoria: "?",
        motivo: "No se pudo detectar categoría desde la carpeta raíz",
        solucion: "Coloca el archivo bajo images/<categoria>/…",
      });
      continue;
    }
    if (!ALLOWED_EXT.has(ext)) {
      report.rechazadas++;
      report.errores.push({
        archivo: file,
        categoria: slug,
        motivo: `Extensión no permitida (${ext})`,
        solucion: "Usa JPG, PNG o WebP",
      });
      continue;
    }
    const st = await fs.stat(file);
    if (st.size > MAX_INPUT) {
      report.rechazadas++;
      report.errores.push({
        archivo: file,
        categoria: slug,
        motivo: `Archivo supera ${MAX_INPUT / (1024 * 1024)} MB`,
        solucion: "Reduce el tamaño antes de importar o sube IMPORT_MAX_INPUT_MB",
      });
      continue;
    }
    if (!catBySlug.has(slug)) {
      report.rechazadas++;
      report.errores.push({
        archivo: file,
        categoria: slug,
        motivo: "Categoría no existe en PostgreSQL",
        solucion: "Ejecuta supabase/seed/categories.sql",
      });
      continue;
    }
    valid.push({ file, slug });
  }

  report.validas = valid.length;

  for (let i = 0; i < valid.length; i += BATCH) {
    const batch = valid.slice(i, i + BATCH);
    for (const item of batch) {
      try {
        const buf = await fs.readFile(item.file);
        const hash = contentHash(buf);
        const storagePath = `${item.slug}/import/${hash}.webp`;

        const optimized = await sharp(buf)
          .rotate()
          .resize({
            width: MAX_W,
            height: MAX_H,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: QUALITY })
          .toBuffer();

        report.procesadas++;

        if (DRY) {
          console.log(`[dry] ${item.file} -> ${storagePath} (${optimized.length} bytes)`);
          continue;
        }

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, optimized, {
            contentType: "image/webp",
            upsert: false,
          });

        if (upErr && !upErr.message.toLowerCase().includes("already exists")) {
          throw upErr;
        }

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        const cat = catBySlug.get(item.slug)!;
        const n = (counters.get(item.slug) ?? 0) + 1;
        counters.set(item.slug, n);
        const nombre = `${cat.nombre} #${String(n).padStart(3, "0")}`;

        const { data: product, error: pErr } = await supabase
          .from("productos")
          .insert({
            categoria_id: cat.id,
            nombre,
            orden: n,
            visible: true,
          })
          .select("id")
          .single();
        if (pErr) throw pErr;

        const { error: iErr } = await supabase.from("producto_imagenes").insert({
          producto_id: product.id,
          storage_path: storagePath,
          public_url: pub.publicUrl,
          orden: 1,
        });
        if (iErr) throw iErr;

        report.subidas++;
        if (report.subidas % 25 === 0) {
          console.log(`Subidas: ${report.subidas}/${report.validas}`);
        }
      } catch (err) {
        report.rechazadas++;
        report.errores.push({
          archivo: item.file,
          categoria: item.slug,
          motivo: err instanceof Error ? err.message : String(err),
          solucion: "Revisa el archivo y vuelve a ejecutar el importador",
        });
      }
    }
  }

  console.log("\n═══ REPORTE IMPORTACIÓN URB STREET ═══");
  console.log(`Encontradas: ${report.encontradas}`);
  console.log(`Válidas:     ${report.validas}`);
  console.log(`Procesadas:  ${report.procesadas}`);
  console.log(`Subidas:     ${report.subidas}`);
  console.log(`Rechazadas:  ${report.rechazadas}`);
  console.log(`Errores:     ${report.errores.length}`);
  if (report.errores.length) {
    console.log("\nDetalle errores:");
    for (const e of report.errores.slice(0, 50)) {
      console.log(`- ${e.archivo}`);
      console.log(`  categoría: ${e.categoria}`);
      console.log(`  motivo: ${e.motivo}`);
      console.log(`  solución: ${e.solucion}`);
    }
    if (report.errores.length > 50) {
      console.log(`… y ${report.errores.length - 50} más`);
    }
  }

  const reportPath = path.resolve("scripts/import-images/report-last.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`\nReporte guardado en ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
