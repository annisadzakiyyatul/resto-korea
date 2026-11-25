
/*
 * SEOUL BITES - KONFIGURASI SUPABASE
 * Isi URL project dan anon/public key dari Project Settings > API.
 * JANGAN masukkan service_role key ke file website.
 */
(function () {
  const SUPABASE_URL = 'ISI_PROJECT_URL_DI_SINI';
  const SUPABASE_ANON_KEY = 'ISI_ANON_PUBLIC_KEY_DI_SINI';

  if (!window.supabase ||
      SUPABASE_URL.startsWith('ISI_') ||
      SUPABASE_ANON_KEY.startsWith('ISI_')) {
    console.warn('Supabase belum dikonfigurasi. Isi supabase-config.js.');
    window.supabaseClient = null;
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
})();