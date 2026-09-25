-- URB Street V1.1 — agregar categoría Bermudas (idempotente)
-- Ejecutar UNA vez en Supabase SQL Editor.
-- No elimina datos. Solo inserta/actualiza orden de categorías oficiales.

insert into public.categorias (nombre, slug, orden, activo)
values
  ('Gorras', 'gorras', 1, true),
  ('Camisetas', 'camisetas', 2, true),
  ('Pantalones', 'pantalones', 3, true),
  ('Conjuntos', 'conjuntos', 4, true),
  ('Pantalonetas', 'pantalonetas', 5, true),
  ('Bermudas', 'bermudas', 6, true),
  ('Zapatos', 'zapatos', 7, true),
  ('Accesorios', 'accesorios', 8, true)
on conflict (slug) do update set
  nombre = excluded.nombre,
  orden = excluded.orden,
  activo = excluded.activo;

-- Verificar: 8 activas en orden
-- select slug, nombre, orden, activo from public.categorias where activo order by orden;
