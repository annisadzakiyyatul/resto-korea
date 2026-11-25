/*
 * SEOUL BITES - KONFIGURASI SUPABASE
 * Isi URL project dan anon/public key dari Project Settings > API.
 * JANGAN masukkan service_role key ke file website.
 */

(function () {
  const SUPABASE_URL = 'https://mdcniinuzibdredpejuq.supabase.co';

  const SUPABASE_ANON_KEY = 'sb_publishable_N_Yt2JgUFKqxffY9IW85iw_bqqUkQoi';

  if (!window.supabase) {
    console.error('Library Supabase belum dimuat.');
    window.supabaseClient = null;
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
})();
