# Seguridad — URB Street V1

## Principios

- Un solo administrador vía **Supabase Auth**
- Sin contraseñas en el frontend
- Sin `service_role` / DB password / tokens privados en el repo
- Solo en `.env` local / secrets de Cloudflare: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

## RLS (resumen)

| Tabla | anon | authenticated |
|-------|------|---------------|
| categorias | SELECT si `activo` | ALL |
| productos | SELECT si `visible` | ALL |
| producto_imagenes | SELECT si producto visible | ALL |

Storage `product-images`:

- Lectura pública (CDN)
- Insert/update/delete solo `authenticated`

## Admin

- Entrada discreta `⋮` → Administrador
- Credenciales solo en Supabase Auth (crear usuario en dashboard)
- No hay registro público ni recuperación de contraseña en V1

## Importador

El script de importación usa `SUPABASE_SERVICE_ROLE_KEY` **solo en máquina local**.

- No commitear esa key
- No exponerla en Cloudflare Pages ni en el bundle

## Checklist

- [ ] `.env` en `.gitignore`
- [ ] Migración SQL aplicada
- [ ] Bucket policies activas
- [ ] Un solo user admin
- [ ] Publishable key (no service role) en Pages
