# URB Street

Catálogo web profesional de moda urbana. No es un ecommerce.

URB Street permite mostrar productos con fotografías, referencias cortas y contacto directo por WhatsApp. El administrador puede actualizar el catálogo visual sin depender de un programador para cada cambio.

## Qué problema resuelve

| Actor | Necesidad |
|-------|-----------|
| Negocio | Publicar un catálogo curado, rápido y con identidad streetwear |
| Comprador | Ver productos y consultar por WhatsApp |
| Administrador | Agregar, etiquetar y eliminar fotos sin tocar código |

**Fuera de alcance V1:** carrito, pagos, checkout, cuentas de compradores, inventario avanzado, importación masiva, analytics y dominio personalizado.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend (BaaS):** Supabase Auth, PostgreSQL, Storage
- **Hosting:** Cloudflare (Workers/Pages)
- **Código:** GitHub

## Arquitectura

```text
Comprador ──► Catálogo React ──► Supabase (lectura)
Admin     ──► Mismo catálogo + Auth ──► Supabase (escritura)
                                       Storage: product-images
WhatsApp  ◄── enlace centralizado (wa.me)
```

- El público navega sin cuenta.
- El administrador inicia sesión con Supabase Auth y usa la misma interfaz con controles extra.
- Las imágenes viven en Storage (`product-images`); PostgreSQL guarda metadatos y referencias.
- Las ventas se gestionan por WhatsApp (+57 316 141 6538).

## Flujo comprador

1. Entra al catálogo.
2. Navega por categorías (Gorras, Camisetas, Pantalones, Conjuntos, Pantalonetas, Zapatos, Accesorios).
3. Ve fotografías con referencia corta bajo cada imagen.
4. Pulsa **Preguntar** → WhatsApp con la referencia del producto.

Categorías sin fotos muestran: **Próximamente nuevos productos**.

## Flujo administrador

1. Menú `⋮` → Administrador → login (Supabase Auth).
2. Banner **MODO ADMINISTRADOR**.
3. `+ Imagen` en una categoría → selecciona archivo → escribe referencia corta (máx. 50 caracteres).
4. `⋮` en cada card → **Editar referencia** o **Eliminar imagen**.
5. Al eliminar: se borra el archivo en Storage, el registro en `producto_imagenes` y el producto si ya no tiene imágenes.

No hay importación masiva en la UI. El catálogo se cura a mano (recomendación: hasta ~100 imágenes seleccionadas por categoría en esta etapa).

## Límites operativos

- Subir solo fotos seleccionadas y con calidad suficiente.
- Evitar duplicados y carpetas completas sin revisión.
- El crecimiento (más fotos, más tráfico) puede requerir plan de pago o cambios de arquitectura.
- Optimización WebP en el cliente antes de subir (sin Image Transformations Pro).

## Despliegue

1. Repo GitHub → Cloudflare Pages/Workers.
2. Build: `npm run build`
3. Output: `dist`
4. Variables de entorno (solo públicas):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

**No configurar en Cloudflare:** `service_role`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, contraseñas ni recovery codes.

## Desarrollo local

```bash
npm install
# completar .env (ver .env.example)
npm run dev
npm run build
```

Validación opcional de un flujo de imagen (solo local, credenciales en `.env` sin prefijo `VITE_`):

```bash
node scripts/validate-one-image.mjs
```

## Seguridad

- Sin contraseñas hardcodeadas en el frontend de producción.
- Sin `service_role` en el cliente.
- `.env` fuera de Git.
- Admin autenticado con Supabase Auth + RLS / Storage policies.

## Escalabilidad futura (no incluido en V1)

- Dominio personalizado
- Optimización / CDN de imágenes más avanzada
- Roles administrativos adicionales
- Analytics
- Ecommerce completo **solo si el cliente lo solicita**

## Licencia

Proyecto privado de URB Street.
