# URB Street

Catálogo web profesional de moda urbana. **No es un ecommerce.**

URB Street muestra productos con fotografías curadas, referencias cortas y contacto directo por WhatsApp. El administrador actualiza el catálogo visual sin contratar desarrollo para cada cambio de foto.

## Qué problema resuelve

| Actor | Necesidad |
|-------|-----------|
| Negocio | Publicar un catálogo curado, rápido y con identidad streetwear |
| Comprador | Ver productos y consultar por WhatsApp |
| Administrador | Agregar, reemplazar, etiquetar y eliminar fotos sin tocar código |

**Fuera de alcance:** carrito, pagos, checkout, cuentas de compradores, inventario avanzado, importación masiva, analytics y dominio personalizado.

## Stack

- React, TypeScript, Vite, Tailwind CSS
- Supabase Auth, PostgreSQL, Storage (`product-images`)
- Cloudflare Workers/Pages
- GitHub

## Arquitectura

```text
Comprador ──► Catálogo React ──► Supabase (lectura)
Admin     ──► Mismo catálogo + Auth ──► Supabase (escritura)
                                       Storage: product-images
WhatsApp  ◄── enlace centralizado (wa.me)
```

## Categorías (V1.1)

1. Gorras  
2. Camisetas  
3. Pantalones  
4. Conjuntos  
5. Pantalonetas  
6. Bermudas  
7. Zapatos  
8. Accesorios  

Categorías vacías muestran: **Próximamente nuevos productos**.

Para añadir Bermudas en una base ya desplegada, ejecutar una vez:

`supabase/V1.1-ADD-BERMUDAS.sql`

## Flujo comprador

1. Entra al catálogo.
2. Navega por categorías (carrusel con autoplay ~5 s; flechas avanzan de a 1).
3. Ve la referencia corta bajo cada foto.
4. Pulsa **Preguntar** → WhatsApp con esa referencia.

## Flujo administrador

1. Menú `⋮` → Administrador → login (Supabase Auth).
2. Banner **MODO ADMINISTRADOR** (sin autoplay en carruseles).
3. **+ Imagen** en una categoría → archivo → referencia corta (máx. 50 caracteres; fallback por categoría si vacío). La nueva foto se agrega **al final**.
4. Menú `⋮` en cada card:
   - **Editar referencia**
   - **Reemplazar imagen** → misma posición; borra el archivo viejo en Storage
   - **Eliminar imagen** → Storage + DB; libera cupo
5. Al eliminar: archivo en Storage, fila en `producto_imagenes` y producto si ya no tiene imágenes.

### Agregar vs reemplazar

| Acción | Posición | Cupo (máx. 100) | Storage |
|--------|----------|-----------------|---------|
| Agregar | Al final de la categoría | Consume 1 | Sube archivo nuevo |
| Reemplazar | Misma posición (`orden` / producto) | No consume | Sube nuevo + borra viejo |
| Eliminar | Se quita del carrusel | Libera 1 | Borra archivo |

## Límites operativos

- **Máximo 100 imágenes por categoría** (tope visual operativo ~800 con 8 categorías).
- Si se alcanza el límite: *“Límite alcanzado: máximo 100 imágenes por categoría.”*
- Reemplazar sigue permitido con 100.
- Solo fotos seleccionadas manualmente; **no import masivo** ni las 966 fotos del archivo.
- Peso ideal final ~150–350 KB; máximo de subida **5 MB**; WebP recomendado (JPG/PNG aceptados y convertidos).
- Bucket oficial: `product-images` (no `catalogo`).

## Rendimiento

- Lazy loading en imágenes del catálogo.
- Carrusel: un paso por flecha; autoplay pausa tras interacción manual.
- No precarga masiva ni descarga de todo el catálogo en el primer render.

## Despliegue

1. Repo GitHub → Cloudflare Pages/Workers.
2. Build: `npm run build` → output `dist`
3. Variables (solo públicas):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

**No configurar:** `service_role`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` ni secretos.

## Desarrollo local

```bash
npm install
# completar .env (ver .env.example)
npm run dev
npm run build
```

## Seguridad

- Sin contraseñas hardcodeadas en producción.
- Sin `service_role` en el cliente.
- `.env` fuera de Git.
- Admin con Supabase Auth + RLS / Storage policies.

## Escalabilidad futura

- Dominio personalizado
- CDN / optimización avanzada de imágenes
- Roles administrativos
- Analytics
- Ecommerce **solo si el cliente lo pide**
- Plan de pago o nueva arquitectura si el volumen supera el Free tier

## Licencia

Proyecto privado de URB Street.
