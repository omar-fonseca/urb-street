# URB Street

Catálogo web streetwear + WhatsApp + administración simple de fotografías.

**No es un ecommerce.** V1 = catálogo + WhatsApp + admin de fotos.

## Stack

- React + TypeScript + Vite + Tailwind CSS
- Supabase (Auth, PostgreSQL, Storage)
- Cloudflare Pages (deploy) + GitHub

## Requisitos

- Node.js 20+
- Cuenta Supabase del proyecto URB Street
- Variables en `.env` (ver `.env.example`)

## Arranque local

```bash
npm install
# Completa .env (ver docs/SETUP-HOY.md)
npm run dev
```

**Primera vez con Supabase:** ejecuta `supabase/SETUP.sql` en el SQL Editor (tablas + RLS + categorías + Realtime). Guía corta: [docs/SETUP-HOY.md](docs/SETUP-HOY.md).

Build:

```bash
npm run build
```

Salida: `dist/`

## Configurar Supabase

1. Crear proyecto en la cuenta URB Street (no en correo personal del desarrollador).
2. Ejecutar `supabase/migrations/20260316000000_init.sql` en el SQL Editor.
3. Ejecutar `supabase/seed/categories.sql`.
4. Authentication → Users → crear el único administrador (ej. `urb.street1142@gmail.com`).
5. Copiar Project URL y **publishable/anon key** a `.env` (nunca `service_role` en el frontend).

Documentación detallada:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/SECURITY.md](docs/SECURITY.md)
- [docs/IMAGE-IMPORT.md](docs/IMAGE-IMPORT.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## WhatsApp

Número oficial: **+57 316 141 6538** (`573161416538`)

Enlace centralizado en `src/features/whatsapp/waLink.ts`.

## Admin

Acceso discreto: menú `⋮` → Administrador → login Supabase Auth.

En modo admin: banner **MODO ADMINISTRADOR** + Salir. Mismo catálogo; menú por producto: Agregar/Eliminar imagen.

## Imágenes locales

La carpeta `images/` es fuente de importación (ignorada por Git). No forma parte del bundle.

```bash
# Estimar optimización
npm run optimize:images

# Importar a Supabase (requiere service role local)
set SUPABASE_URL=...
set SUPABASE_SERVICE_ROLE_KEY=...
npm run import:images
```

## Nota sobre la ruta del proyecto

En Windows, evita `&` en el nombre de carpeta (`urb&street` rompe scripts `.bin` de npm). Preferir `urb-street`.
