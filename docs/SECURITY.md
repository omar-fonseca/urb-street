# Seguridad — URB Street V1.1

## Principios

- Un administrador vía **Supabase Auth** (usuario creado en el Dashboard).
- Sin contraseñas hardcodeadas en el frontend de producción.
- Sin `service_role`, contraseñas de DB ni tokens privados en el repositorio.
- En Cloudflare Pages solo: `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `.env` en `.gitignore`.

## RLS (resumen)

| Tabla | anon | authenticated |
|-------|------|---------------|
| `categorias` | SELECT si `activo` | ALL |
| `productos` | SELECT si `visible` | ALL |
| `producto_imagenes` | SELECT si el producto es visible | ALL |

Storage `product-images`:

- Lectura pública
- Insert / update / delete solo `authenticated`

## Admin

- Entrada discreta: `⋮` → Administrador
- Credenciales solo en Supabase Auth
- Sin registro público de compradores en V1.1

## Checklist

- [ ] `.env` no versionado
- [ ] SQL / policies aplicados
- [ ] Bucket `product-images` (no `catalogo`)
- [ ] Un solo usuario admin
- [ ] Cloudflare sin `service_role` ni `ADMIN_*`
