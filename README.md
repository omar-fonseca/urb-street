# URB Street

Catálogo web profesional de moda urbana. **No es un ecommerce.**

URB Street permite a un negocio de streetwear mostrar un catálogo curado en la web, recibir consultas por WhatsApp y mantener las fotografías al día desde un panel simple — sin carrito, sin pagos y sin depender de un desarrollador para cada cambio de imagen.

## Problema que resuelve

| Actor | Qué obtiene |
|-------|-------------|
| Negocio | Catálogo público con identidad visual propia |
| Comprador | Explora productos y pregunta por WhatsApp con la referencia exacta |
| Administrador | Agrega, reemplaza, etiqueta y elimina fotos sin tocar código |

**Fuera de alcance V1.1:** carrito, pagos, checkout, cuentas de compradores, inventario avanzado, importación masiva, analytics y dominio personalizado.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Supabase Auth, PostgreSQL, Storage |
| Hosting | Cloudflare Workers / Pages |
| Código | GitHub |

## Arquitectura

```text
Comprador ──► Catálogo React ──► Supabase (lectura pública)
Admin     ──► Misma UI + Auth ──► Supabase (escritura autenticada)
                                  Storage: product-images
WhatsApp  ◄── wa.me (canal comercial)
```

- Frontend público sin cuenta.
- Modo administrador sobre la misma interfaz (controles adicionales).
- Supabase como backend (Auth + DB + Storage).
- WhatsApp como canal de venta e información.

Documentación técnica: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Funcionalidades V1.1

- **8 categorías:** Gorras, Camisetas, Pantalones, Conjuntos, Pantalonetas, Bermudas, Zapatos, Accesorios.
- Referencia corta bajo cada foto (máx. 50 caracteres) y en el mensaje de WhatsApp.
- Carrusel público con autoplay ~5 s y flechas de un paso; en admin, sin autoplay.
- Administrador: agregar imagen (al final), reemplazar (misma posición), editar referencia, eliminar (Storage + DB).
- Límite operativo: **100 imágenes por categoría** (reemplazar no consume cupo).
- Categorías vacías: *Próximamente nuevos productos*.

## Seguridad

- Sin contraseñas hardcodeadas en el frontend de producción.
- Sin `service_role` en el cliente ni en Cloudflare.
- `.env` ignorado por Git.
- Acceso admin solo con **Supabase Auth** + RLS / Storage policies.

Ver [`docs/SECURITY.md`](docs/SECURITY.md).

## Límites operativos

- Solo imágenes seleccionadas manualmente (calidad y curación).
- No importación masiva en la UI; no subir carpetas completas sin revisión.
- Evitar duplicados.
- Peso ideal ~150–350 KB; máximo de subida 5 MB; WebP recomendado.
- Bucket oficial: **`product-images`** (no `catalogo`).
- Si el volumen crece, puede requerirse plan de pago o cambios de arquitectura.

## Despliegue (Cloudflare)

1. Conectar el repo GitHub → Cloudflare Pages / Workers.
2. Build: `npm run build` · Output: `dist`
3. Variables **solo públicas:**

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

**No configurar:** `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`, `service_role` ni contraseñas de base de datos.

Guía: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Desarrollo local

```bash
npm install
# Copiar .env.example → .env y completar claves públicas
npm run dev
npm run build
```

Setup y operación del admin: [`docs/SETUP.md`](docs/SETUP.md), [`docs/ADMIN-AND-IMAGES.md`](docs/ADMIN-AND-IMAGES.md).

## Escalabilidad futura

- Dominio personalizado
- Roles administrativos adicionales
- Analytics
- Optimización / CDN de imágenes más avanzada
- Ecommerce **solo si el cliente lo solicita**

## Licencia

Proyecto privado de URB Street.
