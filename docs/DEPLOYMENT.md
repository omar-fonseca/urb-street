# Despliegue — Cloudflare

## Flujo

```text
GitHub (main) → Cloudflare Pages / Workers → dist/ → Supabase
```

Cloudflare debe desplegar desde la rama **`main`**. Los cambios en ramas de feature requieren PR/merge antes de verse en producción.

## Build settings

| Setting | Valor |
|---------|--------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | 20+ |

## Variables de entorno (solo públicas)

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

### No configurar en Cloudflare

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SUPABASE_SERVICE_ROLE_KEY`
- `service_role`
- Contraseñas de base de datos u otros secretos

El administrador inicia sesión con Supabase Auth; no hay credenciales de admin en el hosting.

## Checklist post-deploy

1. Catálogo carga las 8 categorías.
2. WhatsApp abre con la referencia del producto.
3. Login admin funciona.
4. Agregar / reemplazar / eliminar imagen se refleja en el público.
5. No aparecen secretos en el bundle (revisar Network / variables del proyecto).

## Dominio

Opcional. V1.1 puede operar con la URL `*.workers.dev` / `*.pages.dev` hasta configurar dominio personalizado.

## Rollback

- Cloudflare: rollback al deployment anterior.
- Git: revert del commit y redeploy.
- Supabase: preferir cambios aditivos; backups del proyecto para datos.
