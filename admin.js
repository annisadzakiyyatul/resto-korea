'use strict';

/* =========================================
   SEOUL BITES - ADMIN DASHBOARD
   ========================================= */

/* LOGIN ADMIN */
const ADMIN_USERNAME = 'adminniss';
const ADMIN_PASSWORD = 'SeoulBites1926';

/* KEY PENYIMPANAN */
const ORDER_KEY = 'seoulBitesOrders';
const ADMIN_SESSION_KEY = 'seoulBitesAdminLoggedIn';


/* =========================================
   1. FUNGSI DASAR
   ========================================= */

const $ = (selector) => document.querySelector(selector);


function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}


function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(number) || 0);
}


function getOrders() {
  try {
    const saved = localStorage.getItem(ORDER_KEY);
    const orders = saved ? JSON.parse(saved) : [];

    return Array.isArray(orders) ? orders : [];

  } catch (error) {
    console.error('Gagal membaca pesanan:', error);
    return [];
  }
}


function saveOrders(orders) {
  try {
    localStorage.setItem(
      ORDER_KEY,
      JSON.stringify(orders)
    );

    return true;

  } catch (error) {
    console.error('Gagal menyimpan pesanan:', error);

    alert('Data pesanan gagal disimpan.');

    return false;
  }
}


function getStatusType(order) {
  const status = String(order.status || '').toLowerCase();

  if (status.includes('ditolak')) {
    return 'rejected';
  }

  if (status.includes('diterima')) {
    return 'accepted';
  }

  return 'pending';
}


function formatDate(dateValue) {
  if (!dateValue) return '-';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}


function safeMapLink(value) {
  if (!value || value === '-') return '';

  try {
    const url = new URL(value);

    if (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    ) {
      return url.href;
    }

  } catch (error) {
    return '';
  }

  return '';
}


/* =========================================
   2. LOGIN ADMIN
   ========================================= */

function showLogin() {
  $('#adminLoginSection').hidden = false;
  $('#adminDashboard').hidden = true;
}


function showDashboard() {
  $('#adminLoginSection').hidden = true;
  $('#adminDashboard').hidden = false;

  renderDashboard();
}


$('#adminLoginForm').addEventListener('submit', event => {
  event.preventDefault();

  const username = $('#adminUsername').value.trim();
  const password = $('#adminPassword').value;

  const error = $('#loginError');

  if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    sessionStorage.setItem(
      ADMIN_SESSION_KEY,
      'true'
    );

    error.textContent = '';

    event.target.reset();

    showDashboard();

  } else {
    error.textContent =
      'Username atau password salah. Coba lagi, ya!';
  }
});


/* =========================================
   3. LOGOUT ADMIN
   ========================================= */

$('#logoutButton').addEventListener('click', () => {
  const confirmation = confirm(
    'Apakah kamu yakin ingin logout?'
  );

  if (!confirmation) return;

  sessionStorage.removeItem(ADMIN_SESSION_KEY);

  showLogin();
});


/* =========================================
   4. STATISTIK PESANAN
   ========================================= */

function renderStatistics(orders) {
  const total = orders.length;

  const pending = orders.filter(order =>
    getStatusType(order) === 'pending'
  ).length;

  const accepted = orders.filter(order =>
    getStatusType(order) === 'accepted'
  ).length;

  const rejected = orders.filter(order =>
    getStatusType(order) === 'rejected'
  ).length;

  $('#totalOrders').textContent = total;
  $('#pendingOrders').textContent = pending;
  $('#acceptedOrders').textContent = accepted;
  $('#rejectedOrders').textContent = rejected;
}


/* =========================================
   5. RINCIAN MENU PESANAN
   ========================================= */

function renderOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<p>Tidak ada rincian produk.</p>';
  }

  return items.map(item => {
    const name = escapeHTML(item.name || 'Menu');

    const variant = item.variantName
      ? ` (${escapeHTML(item.variantName)})`
      : '';

    const quantity = Number(item.qty) || 0;
    const price = Number(item.price) || 0;

    return `
      <p>
        ${name}${variant} × ${quantity}
        — ${formatRupiah(price * quantity)}
      </p>
    `;
  }).join('');
}


/* =========================================
   6. KARTU PESANAN PELANGGAN
   ========================================= */

function renderOrderCard(order) {
  const id = String(order.id || '-');
  const status = order.status || 'Menunggu verifikasi pembayaran';

  const statusType = getStatusType(order);

  const name = order.customerName || '-';
  const phone = order.customerPhone || '-';

  const deliveryMethod =
    order.deliveryMethod || 'Ambil Sendiri';

  const address =
    order.deliveryAddress || order.customerAddress || '-';

  const landmark = order.deliveryLandmark || '-';

  const note = order.note || '-';

  const proofName = order.proofFileName || '-';

  const itemsHTML = renderOrderItems(order.items);

  const mapLink = safeMapLink(order.deliveryMapLink);

  let deliveryHTML = `
    <p>
      <b>Metode penerimaan:</b>
      ${escapeHTML(deliveryMethod)}
    </p>
  `;

  if (deliveryMethod === 'Diantar ke Alamat') {
    deliveryHTML += `
      <p>
        <b>Alamat:</b>
        ${escapeHTML(address)}
      </p>

      <p>
        <b>Patokan:</b>
        ${escapeHTML(landmark)}
      </p>

      <p>
        <b>Koordinat GPS:</b>
        ${
          order.deliveryLatitude != null &&
          order.deliveryLongitude != null
            ? `${escapeHTML(order.deliveryLatitude)}, ${escapeHTML(order.deliveryLongitude)}`
            : '-'
        }
      </p>

      ${
        mapLink
          ? `
            <p>
              <a href="${escapeHTML(mapLink)}"
                 target="_blank"
                 rel="noopener noreferrer">
                Lihat Lokasi Pelanggan di Google Maps ↗
              </a>
            </p>
          `
          : ''
      }
    `;
  }

  let actionHTML = '';

  if (statusType === 'pending') {
    actionHTML = `
      <div class="admin-order-actions">

        <button
          type="button"
          class="admin-button admin-button-success"
          data-action="accept"
          data-order-id="${escapeHTML(id)}"
        >
          Terima Pembayaran
        </button>

        <button
          type="button"
          class="admin-button admin-button-danger"
          data-action="reject"
          data-order-id="${escapeHTML(id)}"
        >
          Tolak Pembayaran
        </button>

      </div>
    `;
  } else {
    actionHTML = `
      <p class="admin-note">
        Pesanan ini sudah diverifikasi.
      </p>
    `;
  }

  return `
    <article class="admin-order-card">

      <div class="admin-order-top">

        <div>
          <h3>${escapeHTML(id)}</h3>

          <small>
            ${escapeHTML(formatDate(order.createdAt))}
          </small>
        </div>

        <span class="admin-status ${statusType}">
          ${escapeHTML(status)}
        </span>

      </div>


      <div class="admin-order-info">

        <p>
          <b>Nama pelanggan:</b>
          ${escapeHTML(name)}
        </p>

        <p>
          <b>Nomor WhatsApp:</b>
          ${escapeHTML(phone)}
        </p>

        ${deliveryHTML}

        <p>
          <b>Metode pembayaran:</b>
          ${escapeHTML(order.paymentMethod || 'QRIS')}
        </p>

        <p>
          <b>Catatan pesanan:</b>
          ${escapeHTML(note)}
        </p>

      </div>


      <div class="admin-order-items">

        <b>Daftar pesanan:</b>

        ${itemsHTML}

      </div>


      <div class="admin-proof">

        <b>Bukti pembayaran</b>

        <p>
          Nama file:
          ${escapeHTML(proofName)}
        </p>

        <small>
          Untuk memeriksa gambar bukti, pelanggan perlu
          mengirimkan lampirannya melalui WhatsApp.
        </small>

      </div>


      <div class="admin-order-total">

        Total:
        ${formatRupiah(order.total)}

      </div>


      ${
        order.rejectionReason
          ? `
            <p>
              <b>Alasan penolakan:</b>
              ${escapeHTML(order.rejectionReason)}
            </p>
          `
          : ''
      }

      ${actionHTML}

    </article>
  `;
}


/* =========================================
   7. PENCARIAN DAN FILTER
   ========================================= */

function filterOrders(orders) {
  const keyword = $('#searchOrder').value
    .trim()
    .toLowerCase();

  const filter = $('#filterStatus').value;

  return orders.filter(order => {
    const id = String(order.id || '').toLowerCase();

    const name = String(
      order.customerName || ''
    ).toLowerCase();

    const matchesKeyword =
      id.includes(keyword) ||
      name.includes(keyword);

    const statusType = getStatusType(order);

    const matchesStatus =
      filter === 'Semua' ||
      (filter === 'Menunggu' && statusType === 'pending') ||
      (filter === 'Diterima' && statusType === 'accepted') ||
      (filter === 'Ditolak' && statusType === 'rejected');

    return matchesKeyword && matchesStatus;
  });
}


/* =========================================
   8. MENAMPILKAN DASHBOARD
   ========================================= */

function renderDashboard() {
  const orders = getOrders();

  renderStatistics(orders);

  const container = $('#ordersContainer');

  const filteredOrders = filterOrders(orders);

  if (filteredOrders.length === 0) {
    container.innerHTML = `
      <div class="admin-empty">
        Belum ada pesanan yang sesuai. ♡
      </div>
    `;

    return;
  }

  container.innerHTML = filteredOrders
    .map(order => renderOrderCard(order))
    .join('');
}


/* =========================================
   9. MENERIMA ATAU MENOLAK PESANAN
   ========================================= */

function updateOrderStatus(orderId, newStatus, reason = '') {
  const orders = getOrders();

  const orderIndex = orders.findIndex(order =>
    String(order.id) === String(orderId)
  );

  if (orderIndex === -1) {
    alert('Pesanan tidak ditemukan.');
    return;
  }

  const order = orders[orderIndex];

  if (getStatusType(order) !== 'pending') {
    alert('Pesanan ini sudah diverifikasi.');
    return;
  }

  order.status = newStatus;
  order.verifiedAt = new Date().toISOString();

  if (reason) {
    order.rejectionReason = reason;
  }

  if (saveOrders(orders)) {
    renderDashboard();

    alert('Status pesanan berhasil diperbarui.');
  }
}


/* =========================================
   10. TOMBOL VERIFIKASI
   ========================================= */

$('#ordersContainer').addEventListener('click', event => {
  const button = event.target.closest('[data-action]');

  if (!button) return;

  if (
    sessionStorage.getItem(ADMIN_SESSION_KEY) !== 'true'
  ) {
    showLogin();
    return;
  }

  const action = button.dataset.action;
  const orderId = button.dataset.orderId;

  if (action === 'accept') {
    const confirmation = confirm(
      `Terima pembayaran untuk pesanan ${orderId}?`
    );

    if (!confirmation) return;

    updateOrderStatus(
      orderId,
      'Pembayaran Diterima'
    );
  }


  if (action === 'reject') {
    const reason = prompt(
      'Masukkan alasan penolakan pembayaran:'
    );

    if (reason === null) return;

    if (!reason.trim()) {
      alert('Alasan penolakan harus diisi.');
      return;
    }

    const confirmation = confirm(
      `Tolak pembayaran untuk pesanan ${orderId}?`
    );

    if (!confirmation) return;

    updateOrderStatus(
      orderId,
      'Pembayaran Ditolak',
      reason.trim()
    );
  }
});


/* =========================================
   11. TOMBOL REFRESH DAN FILTER
   ========================================= */

$('#refreshOrders').addEventListener('click', () => {
  renderDashboard();
});


$('#searchOrder').addEventListener('input', () => {
  renderDashboard();
});


$('#filterStatus').addEventListener('change', () => {
  renderDashboard();
});


/* =========================================
   12. UPDATE DATA PESANAN
   ========================================= */

window.addEventListener('storage', event => {
  if (
    event.key === ORDER_KEY &&
    sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  ) {
    renderDashboard();
  }
});


/* =========================================
   13. SAAT HALAMAN DIBUKA
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn =
    sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';

  if (isLoggedIn) {
    showDashboard();
  } else {
    showLogin();
  }
});