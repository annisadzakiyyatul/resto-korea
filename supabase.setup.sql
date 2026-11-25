
-- =====================================
-- SEOUL BITES DATABASE
-- =====================================

-- Membuat tabel pesanan
create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  order_data jsonb not null,
  status text not null default 'Menunggu Verifikasi',
  proof_path text
);

-- Mengaktifkan keamanan tabel
alter table public.orders enable row level security;

-- Pelanggan boleh mengirim pesanan
drop policy if exists "Public can submit orders"
on public.orders;

create policy "Public can submit orders"
on public.orders
for insert
to anon
with check (true);

-- Admin boleh melihat pesanan
drop policy if exists "Admin can read orders"
on public.orders;

create policy "Admin can read orders"
on public.orders
for select
to authenticated
using (
  lower(auth.jwt() ->> 'email') =
  lower('annisadzakiyyatu@gmail.com')
);

-- Admin boleh memperbarui status pesanan
drop policy if exists "Admin can update orders"
on public.orders;

create policy "Admin can update orders"
on public.orders
for update
to authenticated
using (
  lower(auth.jwt() ->> 'email') =
  lower('annisadzakiyyatu@gmail.com')
)
with check (
  lower(auth.jwt() ->> 'email') =
  lower('annisadzakiyyatu@gmail.com')
);

-- =====================================
-- STORAGE FOTO BUKTI PEMBAYARAN
-- =====================================

-- Membuat bucket privat
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types =
    array['image/jpeg', 'image/png', 'image/webp'];

-- Pelanggan boleh mengunggah foto bukti
drop policy if exists "Customers can upload payment proofs"
on storage.objects;

create policy "Customers can upload payment proofs"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'payment-proofs'
);

-- Admin boleh melihat foto bukti pembayaran
drop policy if exists "Admin can view payment proofs"
on storage.objects;

create policy "Admin can view payment proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and lower(auth.jwt() ->> 'email') =
  lower('annisadzakiyyatu@gmail.com')
);