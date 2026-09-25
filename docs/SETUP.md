# Setup local — URB Street

## Requisitos

- Node.js 20+
- Proyecto Supabase con Auth, tablas y bucket `product-images` configurados
- Usuario administrador creado en Supabase Auth (Dashboard)

## Variables de entorno

Copiar `.env.example` → `.env` (el archivo `.env` no se versiona):

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Reglas:

- URL = host del proyecto (**sin** `/rest/v1`).
- Key = anon / publishable (**nunca** `service_role` con prefijo `VITE_`).
- No subir `.env` a Git ni a Cloudflare.

## Base de datos

Si el proyecto es nuevo, ejecutar en el SQL Editor:

1. `supabase/SETUP.sql` (o `REPAIR.sql` si el esquema ya existía a medias)
2. Si falta la categoría Bermudas: `supabase/V1.1-ADD-BERMUDAS.sql` (idempotente)

## Arranque

```bash
npm install
npm run dev
```

Abre http://localhost:5173/

- **Comprador:** catálogo + WhatsApp.
- **Admin:** menú `⋮` → Administrador → login con el usuario de Supabase Auth.

Build de producción:

```bash
npm run build
```

## Documentación relacionada

- [Arquitectura](ARCHITECTURE.md)
- [Admin e imágenes](ADMIN-AND-IMAGES.md)
- [Seguridad](SECURITY.md)
- [Despliegue](DEPLOYMENT.md)
