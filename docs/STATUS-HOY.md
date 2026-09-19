# Estado estable — 18 sep 2026

Punto de recuperación para retomar mañana **sin romper** lo que ya funciona.

## Qué está estable hoy

| Pieza | Estado |
|-------|--------|
| Repo Git + GitHub `omar-fonseca/urb-street` | OK |
| Vite / React / TypeScript / Tailwind | OK (`npm run build`) |
| Identidad visual (hero, header, footer) | OK |
| WhatsApp centralizado `+57 316 141 6538` | OK |
| Login UI admin (`⋮` → Administrador) | OK (código listo) |
| Realtime en código (admin → comprador) | OK (código listo) |
| Importador masivo (script) | OK (código listo, no ejecutado) |
| Docs | `README`, `docs/*`, `SETUP-HOY`, `REPAIR.sql` |
| `.env` local | Presente (gitignored) |
| Cloudflare / dominio | Pendiente (a propósito) |

## Qué NO cerramos hoy (a propósito)

- Alinear schema Supabase con `REPAIR.sql` (el setup parcial no tiene `orden` / `producto_imagenes` / grants / bucket)
- Probar Auth + Realtime end-to-end
- Importar las 966 fotos
- Deploy Cloudflare

## Cómo arrancar mañana (seguro)

```powershell
cd C:\Users\ASUS\Desktop\urb-street
npm run dev
```

Abre http://localhost:5173/

1. Si el catálogo pide configuración → SQL Editor → ejecutar **`supabase/REPAIR.sql`** → Reintentar  
2. Login admin → probar `+ Imagen`  
3. Solo después: `SUPABASE_SERVICE_ROLE_KEY` en `.env` (sin `VITE_`) → `npm run import:images`

## Regla de no destrucción

- No borrar `images/`, estilos, ni el prototipo en `src/legacy/`
- No poner `service_role` en variables `VITE_*`
- No tocar Cloudflare hasta que el catálogo local cargue con fotos
