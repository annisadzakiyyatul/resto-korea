
-- =========================================
-- SEOUL BITES - SUPABASE SETUP
-- VERSI PERBAIKAN FINAL
-- =========================================


-- =========================================
-- 1. TABEL PESANAN
-- =========================================

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    order_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'Menunggu Verifikasi',
    proof_path TEXT
);


-- =========================================
-- 2. AKTIFKAN ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;


-- =========================================
-- 3. HAPUS POLICY LAMA
-- =========================================

DROP POLICY IF EXISTS "Anon can insert orders"
ON public.orders;

DROP POLICY IF EXISTS "Admin can view orders"
ON public.orders;

DROP POLICY IF EXISTS "Admin can update orders"
ON public.orders;


-- =========================================
-- 4. POLICY PELANGGAN
-- Pelanggan hanya boleh mengirim pesanan.
-- =========================================

CREATE POLICY "Anon can insert orders"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (
    status = 'Menunggu Verifikasi'
);


-- =========================================
-- 5. POLICY ADMIN MELIHAT PESANAN
-- =========================================

CREATE POLICY "Admin can view orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
    (SELECT auth.jwt() ->> 'email')
    = 'annisadzakiyyatu@gmail.com'
);


-- =========================================
-- 6. POLICY ADMIN MENGUBAH PESANAN
-- =========================================

CREATE POLICY "Admin can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
    (SELECT auth.jwt() ->> 'email')
    = 'annisadzakiyyatu@gmail.com'
)
WITH CHECK (
    (SELECT auth.jwt() ->> 'email')
    = 'annisadzakiyyatu@gmail.com'
);


-- =========================================
-- 7. HAK AKSES TABEL
-- =========================================

REVOKE ALL ON TABLE public.orders
FROM PUBLIC, anon, authenticated;

GRANT INSERT ON TABLE public.orders TO anon;

GRANT SELECT, UPDATE ON TABLE public.orders
TO authenticated;


-- =========================================
-- 8. STORAGE BUCKET BUKTI PEMBAYARAN
-- =========================================

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'payment-proofs',
    'payment-proofs',
    false,
    5242880,
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp'
    ]
)
ON CONFLICT (id)
DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp'
    ];


-- =========================================
-- 9. POLICY STORAGE
-- =========================================

DROP POLICY IF EXISTS "Anon can upload payment proofs"
ON storage.objects;

DROP POLICY IF EXISTS "Admin can view payment proofs"
ON storage.objects;


-- Pelanggan hanya boleh upload ke folder
-- dengan nama ID pesanan SB-...
CREATE POLICY "Anon can upload payment proofs"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
    bucket_id = 'payment-proofs'
    AND (storage.foldername(name))[1] LIKE 'SB-%'
);


-- Hanya admin yang boleh melihat bukti pembayaran.
CREATE POLICY "Admin can view payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'payment-proofs'
    AND (SELECT auth.jwt() ->> 'email')
        = 'annisadzakiyyatu@gmail.com'
);


-- =========================================
-- 10. FUNGSI CEK STATUS PESANAN
-- Membutuhkan ID dan accessToken.
-- =========================================

DROP FUNCTION IF EXISTS public.get_order_status(TEXT);
DROP FUNCTION IF EXISTS public.get_order_status(TEXT, TEXT);


CREATE OR REPLACE FUNCTION public.get_order_status(
    p_order_id TEXT,
    p_access_token TEXT
)
RETURNS TABLE (
    status TEXT,
    verification_note TEXT,
    verified_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT
        o.status,

        COALESCE(
            o.order_data ->> 'verificationNote',
            ''
        ) AS verification_note,

        CASE
            WHEN o.order_data ->> 'verifiedAt'
                ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T'
            THEN
                (o.order_data ->> 'verifiedAt')::TIMESTAMPTZ
            ELSE NULL
        END AS verified_at

    FROM public.orders AS o

    WHERE o.id = p_order_id
      AND o.order_data ->> 'accessToken' = p_access_token

    LIMIT 1;
$$;


-- =========================================
-- 11. HAK AKSES FUNGSI
-- =========================================

REVOKE ALL ON FUNCTION public.get_order_status(TEXT, TEXT)
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_order_status(TEXT, TEXT)
TO anon, authenticated;


-- =========================================
-- SELESAI
-- =========================================