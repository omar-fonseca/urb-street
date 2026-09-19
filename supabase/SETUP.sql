-- URB Street V1 — ejecutar TODO este archivo una sola vez en:
-- Supabase Dashboard → SQL Editor → New query → Run
--
-- Crea tablas, RLS, storage, categorías y Realtime (admin → comprador).

create extension if not exists "pgcrypto";

-- ─── TABLES ───────────────────────────────────────────────────────────────────

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id) on delete cascade,
  nombre text not null,
  orden integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.producto_imagenes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists productos_categoria_id_idx on public.productos(categoria_id);
create index if not exists productos_visible_orden_idx on public.productos(visible, orden);
create index if not exists producto_imagenes_producto_id_idx on public.producto_imagenes(producto_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists productos_set_updated_at on public.productos;
create trigger productos_set_updated_at
  before update on public.productos
  for each row execute function public.set_updated_at();

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.producto_imagenes enable row level security;

drop policy if exists "categorias_public_read" on public.categorias;
create policy "categorias_public_read"
  on public.categorias for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "productos_public_read" on public.productos;
create policy "productos_public_read"
  on public.productos for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "producto_imagenes_public_read" on public.producto_imagenes;
create policy "producto_imagenes_public_read"
  on public.producto_imagenes for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.productos p
      where p.id = producto_id and p.visible = true
    )
  );

drop policy if exists "categorias_admin_all" on public.categorias;
create policy "categorias_admin_all"
  on public.categorias for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "productos_admin_all" on public.productos;
create policy "productos_admin_all"
  on public.productos for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "producto_imagenes_admin_all" on public.producto_imagenes;
create policy "producto_imagenes_admin_all"
  on public.producto_imagenes for all
  to authenticated
  using (true)
  with check (true);

-- ─── STORAGE ──────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ─── SEED CATEGORÍAS (7 oficiales, sin productos) ─────────────────────────────

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

-- ─── REALTIME (cambio admin → se refleja en comprador) ────────────────────────

do $$
begin
  begin
    alter publication supabase_realtime add table public.categorias;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.productos;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.producto_imagenes;
  exception when duplicate_object then null;
  end;
end $$;
