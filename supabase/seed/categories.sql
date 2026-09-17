-- Seed: seven official categories only. No products.
insert into public.categorias (nombre, slug, orden, activo)
values
  ('Gorras', 'gorras', 1, true),
  ('Camisetas', 'camisetas', 2, true),
  ('Pantalones', 'pantalones', 3, true),
  ('Conjuntos', 'conjuntos', 4, true),
  ('Pantalonetas', 'pantalonetas', 5, true),
  ('Zapatos', 'zapatos', 6, true),
  ('Accesorios', 'accesorios', 7, true)
on conflict (slug) do update set
  nombre = excluded.nombre,
  orden = excluded.orden,
  activo = excluded.activo;
