# Administración e imágenes — URB Street V1.1

## Modelo operativo

El catálogo se cura **manual y selectivamente**.  
No hay importación masiva desde la interfaz. No se deben subir carpetas completas sin revisión visual.

**Bucket oficial:** `product-images`  
**No usar** el bucket `catalogo`.

## Acciones del administrador

| Acción | Comportamiento |
|--------|----------------|
| **Agregar** (`+ Imagen`) | Nueva foto al **final** de la categoría; pide referencia corta (máx. 50); fallback por categoría si queda vacía; consume 1 cupo |
| **Reemplazar** | Misma posición (`producto` + `orden`); borra el archivo viejo en Storage; **no** consume cupo; conserva la referencia salvo que se edite aparte |
| **Editar referencia** | Actualiza `productos.nombre` (máx. 50) |
| **Eliminar** | Quita de la UI; borra fila en `producto_imagenes`; borra archivo en Storage; elimina el producto si ya no tiene imágenes |

## Límite por categoría

- Máximo **100** imágenes por categoría (~800 en total con 8 categorías).
- Al alcanzar el límite: *“Límite alcanzado: máximo 100 imágenes por categoría.”*
- Reemplazar sigue permitido.
- Eliminar libera un cupo.

## Calidad recomendada

| Criterio | Valor |
|----------|--------|
| Peso ideal final | ~150–350 KB |
| Máximo de subida | 5 MB |
| Formato | WebP (JPG/PNG se aceptan y optimizan en el cliente) |

La optimización ocurre en el navegador (`src/lib/imageOptimize.ts`) antes de subir; no requiere Image Transformations Pro.

## Rendimiento público

- Lazy loading en las imágenes del catálogo.
- Carrusel: autoplay ~5 s; un paso por flecha; pausa tras interacción manual.
- En modo admin: sin autoplay.

## Script de importación (fuera de la operación V1.1)

Existe `npm run import:images` para uso **local avanzado** con `SUPABASE_SERVICE_ROLE_KEY` (nunca en el frontend ni en Cloudflare).  
**No forma parte del flujo V1.1** ni debe usarse para cargar catálogos completos sin curación. La recomendación de producto es subir solo fotos seleccionadas desde el administrador.
