# Arquitectura — URB Street V1

## Producto

```text
CATÁLOGO + WHATSAPP + ADMIN DE FOTOGRAFÍAS
```

## Diagrama

```text
                     URB STREET
                         |
              +----------+----------+
              |                     |
           PÚBLICO                ADMIN
              |                     |
          CATÁLOGO              AUTH
              |                     |
              |               MODO ADMIN
              |                     |
              +----------+----------+
                         |
                      SUPABASE
              +----------+----------+
              |          |          |
             AUTH        DB       STORAGE
```

## Capas frontend

| Ruta | Responsabilidad |
|------|-----------------|
| `src/features/catalog` | UI catálogo, carrusel, cards |
| `src/features/admin` | Login UI, barra modo admin |
| `src/features/auth` | Hook sesión Supabase |
| `src/features/whatsapp` | `waLink()` centralizado |
| `src/services/catalog` | Lectura catálogo + mutaciones imagen |
| `src/services/storage` | Upload/delete Storage |
| `src/services/supabase` | Cliente único |
| `src/hooks` | Estado async catálogo |
| `src/types` | Tipos de dominio |
| `scripts/import-images` | Importación masiva local → Storage/DB |

## Datos

- `categorias` — 7 fijas (seed)
- `productos` — metadatos; nombres neutros tipo `Gorras #001` en import
- `producto_imagenes` — `storage_path` + `public_url`

Binarios solo en Storage bucket `product-images`.

## Extensibilidad

Nuevas funciones (pagos, inventario, etc.) se agregan como features/servicios nuevos sin rehacer el catálogo. V1 no las implementa.
