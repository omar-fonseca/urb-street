# Despliegue — Cloudflare Pages

## Flujo

```text
GitHub → Cloudflare Pages → dist/ → Supabase
```

## Build settings

| Setting | Valor |
|---------|--------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | 20+ |

## Variables de entorno (Pages)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

No añadir service_role.

## GitHub

1. Crear repo bajo la organización/cuenta **URB Street**
2. Push de `main`
3. Conectar el repo en Cloudflare Pages

## Revertir

- Cloudflare: rollback al deployment anterior
- Git: `git revert` / redeploy del commit estable
- Supabase: migraciones nuevas deben ser aditivas; para rollback de datos usar backups del proyecto

## Fotografías

No van en el bundle. Solo URLs de Storage.

## Dominio

Configurar dominio custom en Cloudflare cuando esté listo. V1 puede usar `*.pages.dev`.
