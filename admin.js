const ADMIN_EMAIL = 'annisadzakiyyatu@gmail.com';

const supabaseClient = window.supabaseClient;

if (!supabaseClient) {
  alert('Supabase belum terhubung. Periksa supabase-config.js');
}

let currentOrders = [];

async function loginAdmin(email, password) {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    alert('Email ini bukan email admin.');
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  if (error) {
    alert('Login gagal: ' + error.message);
    return;
  }

  await loadOrders();
}

async function logoutAdmin() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert('Logout gagal: ' + error.message);
    return;
  }

  location.reload();
}

async function loadOrders() {
  const { data: sessionData } = await supabaseClient.auth.getSession();

  const user = sessionData.session?.user;

  if (!user || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    alert('Silakan login sebagai admin terlebih dahulu.');
    return;
  }

  const { data, error } = await supabaseClient
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    alert('Gagal mengambil pesanan: ' + error.message);
    return;
  }

  currentOrders = data || [];
  console.log('Daftar pesanan:', currentOrders);

  // Panggil fungsi render milik dashboard
  if (typeof renderOrders === 'function') {
    renderOrders(currentOrders);
  }
}

async function getProofImage(proofPath) {
  if (!proofPath) return null;

  const { data, error } = await supabaseClient.storage
    .from('payment-proofs')
    .createSignedUrl(proofPath, 300);

  if (error) {
    console.error('Gagal membuka bukti pembayaran:', error);
    return null;
  }

  return data.signedUrl;
}

async function updateOrderStatus(orderId, newStatus) {
  const { error } = await supabaseClient
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    alert('Gagal memperbarui status: ' + error.message);
    return;
  }

  alert('Status pesanan berhasil diperbarui.');
  await loadOrders();
}

// Periksa sesi login saat halaman admin dibuka
async function checkAdminSession() {
  if (!supabaseClient) return;

  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user;

  if (user && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    await loadOrders();
  }
}

checkAdminSession();

// Muat ulang pesanan setiap 20 detik
setInterval(() => {
  if (supabaseClient) {
    loadOrders();
  }
}, 20000);
