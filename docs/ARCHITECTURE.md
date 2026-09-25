# Arquitectura — URB Street V1.1

## Producto

Catálogo web + WhatsApp + administrador simple de imágenes.  
No incluye carrito, pagos ni checkout.

## Diagrama

```text
                     URB STREET
                         |
              +----------+----------+
              |                     |
           PÚBLICO                ADMIN
         (catálogo)          (Auth + controles)
              |                     |
              +----------+----------+
                         |
                      SUPABASE
              +----------+----------+
              |          |          |
             AUTH      POSTGRES   STORAGE
                                   product-images
                         |
                      WhatsApp
                   (canal comercial)
```

## Capas del frontend

| Ruta | Responsabilidad |
|------|-----------------|
| `src/features/catalog` | Catálogo, carrusel, cards, empty states |
| `src/features/admin` | Login y barra de modo administrador |
| `src/features/auth` | Sesión Supabase |
| `src/features/whatsapp` | Enlaces `wa.me` centralizados |
| `src/services/catalog` | Lectura del catálogo y mutaciones de imagen |
| `src/services/storage` | Upload / delete en Storage |
| `src/services/supabase` | Cliente único |
| `src/lib` | Referencias cortas, optimización WebP |
| `src/hooks` | Estado async del catálogo (+ Realtime) |
| `src/types` | Tipos de dominio |

`src/legacy/` conserva el prototipo Figma Make como referencia histórica; no es la app en producción.

## Datos

| Tabla | Rol |
|-------|-----|
| `categorias` | 8 oficiales (orden fijo) |
| `productos` | Metadatos y referencia corta (`nombre`) |
| `producto_imagenes` | `storage_path`, `public_url`, `orden` |

Binarios solo en el bucket **`product-images`**.

### Categorías (orden)

1. Gorras · 2. Camisetas · 3. Pantalones · 4. Conjuntos · 5. Pantalonetas · 6. Bermudas · 7. Zapatos · 8. Accesorios

Scripts SQL de mantenimiento: `supabase/SETUP.sql`, `supabase/REPAIR.sql`, `supabase/V1.1-ADD-BERMUDAS.sql`, `supabase/seed/categories.sql`.

## Flujos clave

**Comprador:** ve categorías → fotos con referencia → WhatsApp.

**Administrador:** login → agregar (final) / reemplazar (misma posición) / editar referencia / eliminar (Storage + DB).

## Extensibilidad

Nuevas capacidades (pagos, roles, analytics) se agregan como features nuevas sin rehacer el catálogo. V1.1 no las implementa.
