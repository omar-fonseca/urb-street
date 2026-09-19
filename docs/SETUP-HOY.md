# Setup rápido (hoy)

## 1. `.env` (ya casi listo)

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- URL = solo el host del proyecto (**sin** `/rest/v1`)
- Key = `anon` / **publishable** (nunca `service_role` aquí)

## 2. Crear base (obligatorio una vez)

1. Abre Supabase → **SQL Editor**
2. Copia todo el archivo `supabase/SETUP.sql`
3. Run

Eso crea: tablas, RLS, bucket `product-images`, 7 categorías y Realtime.

## 3. Usuario admin

Authentication → Users → el correo/contraseña con el que entrarás al modo admin.

## 4. Arrancar

```powershell
npm run dev
```

- **Comprador:** catálogo + WhatsApp (sin login)
- **Admin:** menú `⋮` → Administrador → login  
  Luego: `+ Imagen` / Eliminar imagen  
  El comprador (otra pestaña) se actualiza solo vía Realtime.

## 5. Después (no bloquea hoy)

- Import masivo: `npm run import:images` (usa `service_role` solo en terminal local)
- Cloudflare Pages + dominio cuando el catálogo ya funcione
