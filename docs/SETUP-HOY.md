# Setup rápido (hoy)

## Si el catálogo da error de permisos / tabla faltante

Ejecuta **`supabase/REPAIR.sql`** en el SQL Editor (idempotente).  
Corrige: grants `anon`, columnas `orden`, tabla `producto_imagenes`, bucket `product-images`, seed y Realtime.

## 1. `.env`

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- URL = solo el host (**sin** `/rest/v1`)
- Key = publishable/anon (nunca `service_role` con prefijo `VITE_`)

Para importar fotos (solo local, script Node):

```env
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...   # secret — NO la subas a Git ni a Cloudflare
```

## 2. Arrancar

```powershell
npm run dev
```

- Comprador: catálogo + WhatsApp
- Admin: `⋮` → Administrador → login → `+ Imagen` / Eliminar
- Realtime: otra pestaña comprador se actualiza sola

## 3. Import masivo

```powershell
npm run import:images
```
