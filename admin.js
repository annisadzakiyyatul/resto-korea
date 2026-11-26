
'use strict';

// =====================================
// SEOUL BITES - ADMIN.JS
// =====================================

const ADMIN_EMAIL = 'annisadzakiyyatu@gmail.com';

const supabaseClient = window.supabaseClient;

let currentOrders = [];
let isAdminLoggedIn = false;
let isLoadingOrders = false;
let isUpdatingOrder = false;
let renderVersion = 0;

// =====================================
// 1. HELPER
// =====================================

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);
}

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Number(value) || 0);
}

function getElement(id) {
    return document.getElementById(id);
}

// Hanya menerima URL HTTP/HTTPS yang valid.
function getSafeURL(value) {
    try {
        const url = new URL(String(value || ''));

        if (
            url.protocol === 'https:' ||
            url.protocol === 'http:'
        ) {
            return url.href;
        }

        return null;
    } catch {
        return null;
    }
}

function showLoginError(message) {
    const errorElement = getElement('loginError');

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function setAdminView(isLoggedIn) {
    const loginSection = getElement('adminLoginSection');
    const dashboard = getElement('adminDashboard');

    if (loginSection) {
        loginSection.style.display = isLoggedIn ? 'none' : 'block';
    }

    if (dashboard) {
        dashboard.style.display = isLoggedIn ? 'block' : 'none';
    }

    isAdminLoggedIn = isLoggedIn;
}

// =====================================
// 2. LOGIN ADMIN
// =====================================

async function loginAdmin(email, password) {
    if (!supabaseClient) {
        throw new Error(
            'Supabase belum terhubung. Periksa supabase.config.js.'
        );
    }

    const cleanEmail = String(email || '').trim().toLowerCase();

    if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
        throw new Error('Email ini bukan email admin.');
    }

    if (!password) {
        throw new Error('Password harus diisi.');
    }

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: cleanEmail,
            password
        });

    if (error) {
        throw error;
    }

    const userEmail = data.user?.email?.toLowerCase();

    if (
        !data.user ||
        userEmail !== ADMIN_EMAIL.toLowerCase()
    ) {
        await supabaseClient.auth.signOut();

        throw new Error('Akun ini tidak memiliki akses admin.');
    }

    return data;
}

// =====================================
// 3. CEK SESSION ADMIN
// =====================================

async function checkAdminSession() {
    if (!supabaseClient) {
        setAdminView(false);

        showLoginError(
            'Supabase belum terhubung. Periksa supabase.config.js.'
        );

        return;
    }

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error('Gagal memeriksa session:', error);

        setAdminView(false);
        return;
    }

    const session = data.session;

    const userEmail = session?.user?.email?.toLowerCase();

    const validAdmin =
        Boolean(session) &&
        userEmail === ADMIN_EMAIL.toLowerCase();

    if (!validAdmin) {
        if (session) {
            await supabaseClient.auth.signOut();
        }

        setAdminView(false);
        return;
    }

    setAdminView(true);

    await loadOrders();
}

// =====================================
// 4. LOGOUT
// =====================================

async function logoutAdmin() {
    if (!supabaseClient) return;

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert('Gagal logout: ' + error.message);
        return;
    }

    currentOrders = [];

    setAdminView(false);

    if (getElement('adminPassword')) {
        getElement('adminPassword').value = '';
    }

    if (getElement('adminUsername')) {
        getElement('adminUsername').value = '';
    }

    if (getElement('ordersContainer')) {
        getElement('ordersContainer').innerHTML = '';
    }

    updateStatistics();
}

// =====================================
// 5. AMBIL PESANAN DARI SUPABASE
// =====================================

async function loadOrders() {
    if (
        !supabaseClient ||
        !isAdminLoggedIn ||
        isLoadingOrders
    ) {
        return;
    }

    isLoadingOrders = true;

    const container = getElement('ordersContainer');

    if (container && currentOrders.length === 0) {
        container.innerHTML = '<p>Memuat pesanan...</p>';
    }

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Jangan tampilkan data jika admin sudah logout.
        if (!isAdminLoggedIn) return;

        currentOrders = data || [];

        updateStatistics();

        await renderOrders();

    } catch (error) {
        console.error('Gagal mengambil pesanan:', error);

        if (container && isAdminLoggedIn) {
            container.innerHTML = `
                <p>
                    Gagal mengambil pesanan:
                    ${escapeHTML(error.message)}
                </p>
            `;
        }
    } finally {
        isLoadingOrders = false;
    }
}

// =====================================
// 6. STATISTIK PESANAN
// =====================================

function updateStatistics() {
    const total = getElement('totalOrders');
    const pending = getElement('pendingOrders');
    const accepted = getElement('acceptedOrders');
    const rejected = getElement('rejectedOrders');

    if (total) {
        total.textContent = currentOrders.length;
    }

    if (pending) {
        pending.textContent = currentOrders.filter(order =>
            order.status === 'Menunggu Verifikasi'
        ).length;
    }

    if (accepted) {
        accepted.textContent = currentOrders.filter(order =>
            order.status === 'Diterima'
        ).length;
    }

    if (rejected) {
        rejected.textContent = currentOrders.filter(order =>
            order.status === 'Ditolak'
        ).length;
    }
}

// =====================================
// 7. FOTO BUKTI PEMBAYARAN
// =====================================

async function getProofImage(proofPath) {
    if (!proofPath || !supabaseClient) {
        return null;
    }

    const { data, error } = await supabaseClient
        .storage
        .from('payment-proofs')
        .createSignedUrl(proofPath, 300);

    if (error) {
        console.error(
            'Gagal membuka bukti pembayaran:',
            error
        );

        return null;
    }

    return data?.signedUrl || null;
}

// =====================================
// 8. TAMPILKAN PESANAN
// =====================================

async function renderOrders() {
    const container = getElement('ordersContainer');

    if (!container || !isAdminLoggedIn) return;

    // Mencegah hasil render lama menimpa hasil terbaru.
    const currentRender = ++renderVersion;

    const searchText =
        (getElement('searchOrder')?.value || '')
            .trim()
            .toLowerCase();

    const selectedStatus =
        getElement('filterStatus')?.value || 'Semua';

    const filteredOrders = currentOrders.filter(order => {
        const details = order.order_data || {};

        const searchableText = [
            order.id,
            details.customerName,
            details.customerPhone
        ].join(' ').toLowerCase();

        const matchSearch =
            searchableText.includes(searchText);

        const matchStatus =
            selectedStatus === 'Semua' ||
            order.status === selectedStatus;

        return matchSearch && matchStatus;
    });

    if (filteredOrders.length === 0) {
        container.innerHTML =
            '<p>Belum ada pesanan yang ditemukan.</p>';

        return;
    }

    const orderHTML = await Promise.all(
        filteredOrders.map(async order => {
            const details = order.order_data || {};

            const items = Array.isArray(details.items)
                ? details.items
                : [];

            const proofURL =
                await getProofImage(order.proof_path);

            const statusClass = {
                'Menunggu Verifikasi': 'status-pending',
                'Diterima': 'status-accepted',
                'Ditolak': 'status-rejected'
            }[order.status] || 'status-pending';

            // Detail produk.
            const itemHTML = items.map(item => {
                const quantity = Math.max(
                    1,
                    Number(item.qty ?? item.quantity ?? 1) || 1
                );

                const price = Number(item.price) || 0;

                const itemTotal = Number(
                    item.subtotal ?? price * quantity
                ) || 0;

                const itemName =
                    item.name || item.productName || 'Produk';

                return `
                    <div class="admin-item">
                        <span>
                            ${escapeHTML(itemName)}
                            ${
                                item.variantName
                                    ? `(${escapeHTML(item.variantName)})`
                                    : ''
                            }
                            x ${quantity}
                        </span>

                        <span>
                            ${formatRupiah(itemTotal)}
                        </span>
                    </div>
                `;
            }).join('');

            const createdAt = order.created_at
                ? new Date(order.created_at).toLocaleString('id-ID')
                : '-';

            const verificationNote =
                details.verificationNote || '';

            const deliveryAddress =
                details.deliveryAddress ||
                details.customerAddress ||
                '-';

            // Validasi link lokasi pengiriman.
            const safeMapLink =
                getSafeURL(details.deliveryMapLink);

            const deliveryDetails = [
                details.deliveryLandmark
                    ? `Patokan: ${escapeHTML(details.deliveryLandmark)}`
                    : '',

                safeMapLink
                    ? `
                        <a
                            href="${escapeHTML(safeMapLink)}"
                            target="_blank"
                            rel="noopener noreferrer">
                            Lihat lokasi pengiriman
                        </a>
                    `
                    : ''
            ].filter(Boolean).join('<br>');

            return `
                <div class="admin-order">

                    <div class="admin-order-header">
                        <div>
                            <strong>
                                Pesanan #${escapeHTML(order.id)}
                            </strong>

                            <p>${escapeHTML(createdAt)}</p>
                        </div>

                        <span class="admin-status ${statusClass}">
                            ${escapeHTML(order.status)}
                        </span>
                    </div>

                    <div class="admin-customer">

                        <p>
                            <strong>Nama:</strong>
                            ${escapeHTML(details.customerName || '-')}
                        </p>

                        <p>
                            <strong>No. HP:</strong>
                            ${escapeHTML(details.customerPhone || '-')}
                        </p>

                        <p>
                            <strong>Metode Pengiriman:</strong>
                            ${escapeHTML(details.deliveryMethod || '-')}
                        </p>

                        <p>
                            <strong>Alamat:</strong>
                            ${escapeHTML(deliveryAddress)}
                        </p>

                        ${
                            deliveryDetails
                                ? `<p>${deliveryDetails}</p>`
                                : ''
                        }

                        <p>
                            <strong>Catatan Pelanggan:</strong>
                            ${escapeHTML(details.note || '-')}
                        </p>

                    </div>

                    <div class="admin-items">
                        <strong>Daftar Pesanan</strong>

                        ${
                            itemHTML ||
                            '<p>Tidak ada detail produk.</p>'
                        }
                    </div>

                    <div class="admin-total">
                        Total: ${formatRupiah(details.total)}
                    </div>

                    <div class="admin-proof">
                        <strong>Bukti Pembayaran</strong>

                        ${
                            proofURL
                                ? `
                                    <p>
                                        <a
                                            href="${escapeHTML(proofURL)}"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            Lihat Foto Bukti Pembayaran
                                        </a>
                                    </p>

                                    <img
                                        src="${escapeHTML(proofURL)}"
                                        alt="Bukti pembayaran"
                                        style="
                                            max-width:250px;
                                            width:100%;
                                            border-radius:10px;
                                        "
                                    >
                                `
                                : `
                                    <p>
                                        Bukti pembayaran belum tersedia
                                        atau gagal dimuat.
                                    </p>
                                `
                        }
                    </div>

                    ${
                        verificationNote
                            ? `
                                <div class="verification-note">
                                    <strong>Catatan Verifikasi:</strong>
                                    <p>
                                        ${escapeHTML(verificationNote)}
                                    </p>
                                </div>
                            `
                            : ''
                    }

                    ${
                        order.status === 'Menunggu Verifikasi'
                            ? `
                                <div class="admin-actions">

                                    <button
                                        class="admin-accept"
                                        data-action="accept"
                                        data-id="${escapeHTML(order.id)}">
                                        Terima Pembayaran
                                    </button>

                                    <button
                                        class="admin-reject"
                                        data-action="reject"
                                        data-id="${escapeHTML(order.id)}">
                                        Tolak Pembayaran
                                    </button>

                                </div>
                            `
                            : `
                                <p class="admin-verified-note">
                                    Pesanan sudah diverifikasi.
                                </p>
                            `
                    }

                </div>
            `;
        })
    );

    // Pastikan hasil render masih yang paling baru.
    if (
        currentRender !== renderVersion ||
        !isAdminLoggedIn
    ) {
        return;
    }

    container.innerHTML = orderHTML.join('');
}

// =====================================
// 9. UPDATE STATUS PEMBAYARAN
// =====================================

async function updateOrderStatus(orderId, newStatus) {
    if (!isAdminLoggedIn || !supabaseClient) {
        alert('Silakan login sebagai admin terlebih dahulu.');
        return;
    }

    if (!['Diterima', 'Ditolak'].includes(newStatus)) {
        alert('Status pesanan tidak valid.');
        return;
    }

    if (isUpdatingOrder) {
        alert('Sedang memproses perubahan pesanan.');
        return;
    }

    const existingOrder = currentOrders.find(
        order => order.id === orderId
    );

    if (!existingOrder) {
        alert('Pesanan tidak ditemukan.');
        return;
    }

    if (existingOrder.status !== 'Menunggu Verifikasi') {
        alert('Pesanan ini sudah diverifikasi sebelumnya.');
        return;
    }

    let verificationNote = '';

    if (newStatus === 'Diterima') {
        verificationNote =
            'Pembayaran telah diterima oleh admin.';
    }

    if (newStatus === 'Ditolak') {
        verificationNote = prompt(
            'Masukkan alasan penolakan pembayaran:'
        );

        if (verificationNote === null) {
            return;
        }

        verificationNote = verificationNote.trim();

        if (!verificationNote) {
            alert('Alasan penolakan harus diisi.');
            return;
        }
    }

    const confirmed = confirm(
        `Yakin ingin mengubah status pesanan menjadi "${newStatus}"?`
    );

    if (!confirmed) return;

    isUpdatingOrder = true;

    try {
        const updatedOrderData = {
            ...(existingOrder.order_data || {}),
            verificationNote,
            verifiedAt: new Date().toISOString()
        };

        const { data, error } = await supabaseClient
            .from('orders')
            .update({
                status: newStatus,
                order_data: updatedOrderData
            })
            .eq('id', orderId)
            .eq('status', 'Menunggu Verifikasi')
            .select('id')
            .maybeSingle();

        if (error) {
            throw error;
        }

        // Jika tidak ada baris yang berubah, pesanan mungkin
        // sudah diproses oleh admin lain.
        if (!data) {
            alert(
                'Pesanan tidak berhasil diperbarui. ' +
                'Mungkin pesanan sudah diverifikasi sebelumnya.'
            );

            await loadOrders();
            return;
        }

        alert('Status pesanan berhasil diperbarui.');

        await loadOrders();

    } catch (error) {
        console.error(
            'Gagal memperbarui pesanan:',
            error
        );

        alert(
            'Gagal memperbarui pesanan: ' + error.message
        );

    } finally {
        isUpdatingOrder = false;
    }
}

// =====================================
// 10. EVENT LISTENER
// =====================================

function initializeAdmin() {
    const requiredElements = [
        'adminLoginForm',
        'adminLoginSection',
        'adminDashboard',
        'adminUsername',
        'adminPassword',
        'loginError',
        'ordersContainer',
        'searchOrder',
        'filterStatus',
        'refreshOrders',
        'logoutButton',
        'totalOrders',
        'pendingOrders',
        'acceptedOrders',
        'rejectedOrders'
    ];

    const missingElements = requiredElements.filter(
        id => !getElement(id)
    );

    if (missingElements.length > 0) {
        console.error(
            'Elemen HTML tidak ditemukan:',
            missingElements
        );

        return;
    }

    // LOGIN
    getElement('adminLoginForm').addEventListener(
        'submit',
        async event => {
            event.preventDefault();

            const email =
                getElement('adminUsername').value;

            const password =
                getElement('adminPassword').value;

            showLoginError('');

            const loginButton =
                getElement('adminLoginForm').querySelector(
                    'button[type="submit"]'
                );

            if (loginButton) {
                loginButton.disabled = true;
            }

            try {
                await loginAdmin(email, password);

                await checkAdminSession();

            } catch (error) {
                console.error('Login gagal:', error);

                showLoginError(
                    error.message ||
                    'Login gagal. Periksa email dan password.'
                );

            } finally {
                if (loginButton) {
                    loginButton.disabled = false;
                }
            }
        }
    );

    // TOMBOL TERIMA / TOLAK PESANAN
    getElement('ordersContainer').addEventListener(
        'click',
        async event => {
            const target = event.target;

            if (!(target instanceof Element)) return;

            const button = target.closest(
                'button[data-action]'
            );

            if (!button) return;

            const orderId = button.dataset.id;
            const action = button.dataset.action;

            if (!orderId) return;

            if (action === 'accept') {
                await updateOrderStatus(
                    orderId,
                    'Diterima'
                );
            }

            if (action === 'reject') {
                await updateOrderStatus(
                    orderId,
                    'Ditolak'
                );
            }
        }
    );

    // PENCARIAN
    getElement('searchOrder').addEventListener(
        'input',
        renderOrders
    );

    // FILTER STATUS
    getElement('filterStatus').addEventListener(
        'change',
        renderOrders
    );

    // REFRESH MANUAL
    getElement('refreshOrders').addEventListener(
        'click',
        loadOrders
    );

    // LOGOUT
    getElement('logoutButton').addEventListener(
        'click',
        logoutAdmin
    );

    // CEK SESSION SAAT HALAMAN DIBUKA
    checkAdminSession();

    // AUTO REFRESH SETIAP 20 DETIK
    setInterval(() => {
        if (isAdminLoggedIn) {
            loadOrders();
        }
    }, 20000);
}

// =====================================
// 11. JALANKAN ADMIN
// =====================================

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initializeAdmin,
        { once: true }
    );
} else {
    initializeAdmin();
}