# Importación de imágenes

## Fuente

```text
images/
├── gorras/          (o "Gorras 1.1")
├── camisetas/
├── pantalones/
├── conjuntos/
├── pantalonetas/
├── zapatos/
└── accesorios/
```

Subcarpetas (marcas, orígenes) se conservan como **origen**.  
**No** se publican como nombres comerciales automáticamente.

Cada imagen válida → 1 producto con nombre neutro `{Categoría} #NNN` + 1 registro en `producto_imagenes`.

## Inspección previa (cuotas Free)

Inventario actual aproximado del repo local (sep 2026):

| Categoría | Archivos | Tamaño |
|-----------|----------|--------|
| Camisetas | 530 | ~75 MB |
| Gorras 1.1 | 222 | ~161 MB |
| Pantalones | 93 | ~10 MB |
| Pantalonetas | 88 | ~16 MB |
| Conjuntos | 33 | ~8 MB |
| **Total** | **966 JPG** | **~269 MB** |

Tras WebP ~1200px / q82 se espera quedar cómodamente bajo 1 GB Storage Free, pero conviene correr:

```bash
npm run optimize:images
```

## Importar

```bash
# PowerShell
$env:SUPABASE_URL="https://xxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # solo local
# opcional: $env:IMPORT_DRY_RUN="1"
npm run import:images
```

Límites configurables:

- `IMPORT_MAX_WIDTH` (default 1200)
- `IMPORT_MAX_HEIGHT` (default 1500)
- `IMPORT_QUALITY` (default 82)
- `IMPORT_MAX_INPUT_MB` (default 15)
- `IMPORT_BATCH_SIZE` (default 20)

## Reporte

Consola + `scripts/import-images/report-last.json`:

```text
Encontradas / Válidas / Procesadas / Subidas / Rechazadas / Errores
```

Cada error incluye archivo, categoría, motivo y solución.

## Admin en runtime

Agregar/eliminar foto desde el catálogo (modo admin) usa optimización WebP en el navegador (`src/lib/imageOptimize.ts`) antes de subir — sin Image Transformations Pro.
