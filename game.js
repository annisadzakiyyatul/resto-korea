
'use strict';

/* =========================================
   SEOUL BITES - JAVASCRIPT UTAMA
   ========================================= */

const WHATSAPP_NUMBER = '628562732574';

const CART_KEY = 'seoulBitesCart';
const ORDER_KEY = 'seoulBitesOrders';

const PROOF_DB_NAME = 'seoulBitesProofDB';
const PROOF_STORE_NAME = 'proofs';

/* =========================================
   1. DATA MENU
   ========================================= */

const menuItems = [
    {
        id: 1,
        name: 'Bibimbap',
        category: 'Makanan',
        price: 28000,
        description: 'Nasi campur Korea dengan sayuran, daging, telur, dan saus gochujang.',
        image: 'images/bibimbap.jpg'
    },
    {
        id: 2,
        name: 'Bulgogi Skewers',
        category: 'Camilan',
        price: 25000,
        description: 'Sate daging sapi dengan bumbu bulgogi manis dan gurih khas Korea.',
        image: 'images/bulgogi skewers.jpg'
    },
    {
        id: 3,
        name: 'Korean Corndog',
        category: 'Camilan',
        price: 18000,
        description: 'Sosis dan keju mozzarella berbalut adonan renyah.',
        image: 'images/korean corndog.jpg'
    },
    {
        id: 4,
        name: 'Creamy Rose Tteokbokki',
        category: 'Makanan',
        price: 27000,
        description: 'Kue beras kenyal dalam saus creamy rose yang pedas dan gurih.',
        image: 'images/creamy rose tteobokki.jpg'
    },
    {
        id: 5,
        name: 'Dakgangjeong',
        category: 'Makanan',
        price: 25000,
        description: 'Ayam goreng tepung renyah berbalut saus manis pedas.',
        image: 'images/dakgangjeong.jpg'
    },
    {
        id: 6,
        name: 'Kimbab',
        category: 'Makanan',
        price: 20000,
        description: 'Nasi gulung rumput laut berisi sayuran dan telur.',
        image: 'images/kimbab.jpg'
    },
    {
        id: 7,
        name: 'Kimchi Dumplings',
        category: 'Camilan',
        price: 20000,
        description: 'Pangsit isi kimchi dan daging cincang yang gurih.',
        image: 'images/kimchi dumplings.jpg'
    },
    {
        id: 8,
        name: 'Kimchi Jjigae',
        category: 'Makanan',
        price: 30000,
        description: 'Sup kimchi pedas hangat dengan tahu dan daging.',
        image: 'images/kimchi jjigae.jpg'
    },
    {
        id: 9,
        name: 'Kimchi Pancake',
        category: 'Camilan',
        price: 22000,
        description: 'Panekuk gurih dan renyah dengan irisan kimchi.',
        image: 'images/kimchi pancake.jpg'
    },
    {
        id: 10,
        name: 'Korean Cream Cheese Garlic',
        category: 'Camilan',
        price: 20000,
        description: 'Roti panggang dengan isian krim keju dan mentega bawang putih.',
        image: 'images/korean cream cheese garlic.jpg'
    },
    {
        id: 11,
        name: 'Korean Jajangmyeon',
        category: 'Makanan',
        price: 28000,
        description: 'Mi kenyal dengan saus kedelai hitam pekat dan daging.',
        image: 'images/korean jajangmyeon.jpeg'
    },
    {
        id: 12,
        name: 'Korean Toast',
        category: 'Camilan',
        price: 18000,
        description: 'Roti lapis telur, kol, dan saus manis gurih khas jalanan Korea.',
        image: 'images/korean toast.jpg'
    },
    {
        id: 13,
        name: 'Sweet Potato',
        category: 'Camilan',
        price: 15000,
        description: 'Ubi manis panggang ala Korea yang hangat dan legit.',
        image: 'images/sweet potato.jpg'
    },
    {
        id: 14,
        name: 'Tteokbokki',
        category: 'Makanan',
        price: 22000,
        description: 'Kue beras kenyal dengan saus pedas manis gochujang.',
        image: 'images/tteokbokki.jpg'
    },
    {
        id: 15,
        name: 'Tteokgalbi',
        category: 'Makanan',
        price: 30000,
        description: 'Daging cincang berbumbu manis gurih yang dipanggang hingga matang.',
        image: 'images/tteokgalbi.jpg'
    },
    {
        id: 16,
        name: 'Tteok-Kkochi',
        category: 'Camilan',
        price: 15000,
        description: 'Sate kue beras goreng dengan saus pedas manis.',
        image: 'images/tteok-kkochi.jpg'
    },
    {
        id: 17,
        name: 'Dubai Chewy Cookie',
        category: 'Dessert',
        price: 18000,
        description: 'Kue cokelat tebal dengan tekstur renyah di luar dan kenyal di dalam.',
        image: 'images/dubai chewy cookie.jpg'
    },
    {
        id: 18,
        name: 'Dalgona Coklat',
        category: 'Minuman',
        price: 15000,
        description: 'Susu segar dengan topping krim cokelat dalgona tebal.',
        image: 'images/dalgona coklat.jpg'
    },
    {
        id: 19,
        name: 'Strawberry Milk',
        category: 'Minuman',
        price: 17000,
        description: 'Susu segar dengan potongan buah stroberi.',
        image: 'images/strawberry milk.jpg'
    },
    {
        id: 20,
        name: 'Strawberry Bingsoo',
        category: 'Dessert',
        price: 16000,
        description: 'Es serut salju Korea dengan topping stroberi manis.',
        image: 'images/strawberry bingsoo.jpg'
    },
    {
        id: 21,
        name: 'Caramel Latte',
        category: 'Minuman',
        price: 18000,
        description: 'Perpaduan espresso, susu creamy, dan sirup karamel manis.',
        image: 'images/caramel latte.jpg'
    },
    {
        id: 22,
        name: 'Chicken Wings',
        category: 'Makanan',
        price: 23000,
        description: 'Sayap ayam goreng renyah dengan bumbu gurih dan saus spesial.',
        image: 'images/chicken wings.jpg'
    },
    {
        id: 23,
        name: 'Cookies',
        category: 'Dessert',
        price: 15000,
        description: 'Cookies lezat dengan enam pilihan rasa favorit.',
        image: 'images/cookies.jpg',
        variants: [
            { name: 'Chocolate', price: 7000 },
            { name: 'Red Velvet', price: 9000 },
            { name: 'Matcha', price: 9500 },
            { name: 'Lotus Biscoff', price: 10000 },
            { name: 'Tiramisu', price: 8000 },
            { name: 'Choco Chip', price: 6000 }
        ]
    },
    {
        id: 24,
        name: 'Dessert Strawberry',
        category: 'Dessert',
        price: 18000,
        description: 'Dessert lembut dengan perpaduan krim manis dan stroberi segar.',
        image: 'images/dessert strawberry.jpg'
    },
    {
        id: 25,
        name: 'Es Coklat',
        category: 'Minuman',
        price: 15000,
        description: 'Minuman cokelat dingin dengan rasa manis dan creamy.',
        image: 'images/es coklat.jpg'
    },
    {
        id: 26,
        name: 'Milk Tea',
        category: 'Minuman',
        price: 15000,
        description: 'Teh pilihan yang dipadukan dengan susu creamy dan rasa manis.',
        image: 'images/milk tea.jpg'
    },
    {
        id: 27,
        name: 'Strawberry Matcha Latte',
        category: 'Minuman',
        price: 19000,
        description: 'Perpaduan matcha, susu creamy, dan stroberi manis.',
        image: 'images/strawberry matcha latte.jpg'
    },
    {
        id: 28,
        name: 'Subak Hwachae',
        category: 'Minuman',
        price: 19500,
        description: 'Minuman buah khas Korea dengan semangka, buah-buahan, dan susu manis.',
        image: 'images/subak hwachae.jpg'
    },
    {
        id: 29,
        name: 'Pumpkin Spice Latte',
        category: 'Minuman',
        price: 17000,
        description: 'Latte creamy dengan perpaduan rasa labu dan rempah yang hangat.',
        image: 'images/Pumpkin Spice Latte.jpg'
    },
    {
        id: 30,
        name: 'Red Velvet',
        category: 'Dessert',
        price: 18000,
        description: 'Kue red velvet lembut dengan rasa cokelat ringan dan krim keju.',
        image: 'images/red velvet.jpg'
    },
    {
        id: 31,
        name: 'Es Taro',
        category: 'Minuman',
        price: 15000,
        description: 'Minuman taro dingin dengan rasa manis, lembut, dan creamy.',
        image: 'images/es taro.jpg'
    },
    {
        id: 32,
        name: 'Milkshake Mangga',
        category: 'Minuman',
        price: 18000,
        description: 'Milkshake mangga segar dengan campuran susu yang creamy.',
        image: 'images/milkshake mangga.jpg'
    },
    {
        id: 33,
        name: 'Oreo Milkshake',
        category: 'Minuman',
        price: 18000,
        description: 'Milkshake susu creamy dengan campuran biskuit Oreo.',
        image: 'images/milkshake oreo.jpg'
    },
    {
        id: 34,
        name: 'Korean Pancake',
        category: 'Dessert',
        price: 15000,
        description: 'Pancake lembut dengan pilihan topping mangga, cokelat, strawberry, anggur, dan keju.',
        image: 'images/korean pancake.jpg',
        variants: [
            { name: 'Mangga', price: 15000 },
            { name: 'Coklat', price: 16000 },
            { name: 'Strawberry', price: 17000 },
            { name: 'Anggur', price: 17000 },
            { name: 'Keju', price: 19000 }
        ]
    },
    {
        id: 36,
        name: 'Potato Cheese Bread',
        category: 'Camilan',
        price: 18000,
        description: 'Roti lembut berisi kentang dan keju dengan rasa gurih dan creamy.',
        image: 'images/Potato Cheese Bread.jpg'
    },
    {
        id: 37,
        name: 'Chicken Katsu Curry',
        category: 'Makanan',
        price: 21500,
        description: 'Ayam katsu renyah yang disajikan dengan nasi hangat dan saus kari yang gurih.',
        image: 'images/chicken katsu curry.jpg'
    },
    {
        id: 38,
        name: 'Han Gang',
        category: 'Makanan',
        price: 20000,
        description: 'Hidangan dengan perpaduan rasa gurih dan manis yang menggugah selera.',
        image: 'images/han gang.jpg'
    },
    {
        id: 39,
        name: 'Jumeokbap',
        category: 'Makanan',
        price: 15000,
        description: 'Nasi kepal khas Korea yang dicampur dengan bumbu pilihan dan bahan pelengkap.',
        image: 'images/jumeokbap.jpeg'
    },
    {
        id: 40,
        name: 'Kimchi Bokkeumbap',
        category: 'Makanan',
        price: 20000,
        description: 'Nasi goreng khas Korea dengan kimchi, telur, dan bumbu gurih bercita rasa sedikit pedas.',
        image: 'images/kimchi bokkeumbap.jpeg'
    },
    {
        id: 41,
        name: 'Kyochon',
        category: 'Makanan',
        price: 22000,
        description: 'Ayam goreng khas Korea dengan balutan saus manis gurih dan tekstur renyah.',
        image: 'images/kyochon.jpg'
    }
];

/* =========================================
   2. FUNGSI DASAR
   ========================================= */

const $ = selector => document.querySelector(selector);

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.error('Gagal membaca data:', error);
        return fallback;
    }
}

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Gagal menyimpan data:', error);
        showToast('Penyimpanan browser gagal.');
        return false;
    }
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Number(number) || 0);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

let toastTimer;

function showToast(message) {
    const toast = $('#toast');

    if (!toast) {
        console.log(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);
}

function getProduct(id) {
    return menuItems.find(item => item.id === Number(id));
}

function getVariant(product, variantName = '') {
    if (!product || !Array.isArray(product.variants)) {
        return null;
    }

    return product.variants.find(
        variant => variant.name === variantName
    ) || product.variants[0] || null;
}

/* =========================================
   3. DATABASE FOTO BUKTI PEMBAYARAN
   ========================================= */

function openProofDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error('Browser tidak mendukung IndexedDB.'));
            return;
        }

        const request = indexedDB.open(PROOF_DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(PROOF_STORE_NAME)) {
                db.createObjectStore(PROOF_STORE_NAME, {
                    keyPath: 'orderId'
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveProofFile(orderId, file) {
    const db = await openProofDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            PROOF_STORE_NAME,
            'readwrite'
        );

        transaction.objectStore(PROOF_STORE_NAME).put({
            orderId,
            file,
            fileName: file.name,
            fileType: file.type,
            savedAt: new Date().toISOString()
        });

        transaction.oncomplete = () => {
            db.close();
            resolve(true);
        };

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };

        transaction.onabort = () => {
            db.close();
            reject(transaction.error);
        };
    });
}

/* =========================================
   4. KERANJANG
   ========================================= */

const savedCart = loadData(CART_KEY, []);

let cart = Array.isArray(savedCart)
    ? savedCart.map(savedItem => {
        const product = getProduct(savedItem.id);
        const qty = Number(savedItem.qty);

        if (!product || !Number.isInteger(qty) || qty <= 0) {
            return null;
        }

        const variant = getVariant(
            product,
            savedItem.variantName || ''
        );

        return {
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.image,
            variantName: variant ? variant.name : '',
            price: variant ? variant.price : product.price,
            qty
        };
    }).filter(Boolean)
    : [];

function saveCart() {
    return saveData(
        CART_KEY,
        cart.map(item => ({
            id: item.id,
            variantName: item.variantName,
            price: item.price,
            qty: item.qty
        }))
    );
}

function getCartTotal() {
    return cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );
}

function getTotalQuantity() {
    return cart.reduce(
        (total, item) => total + item.qty,
        0
    );
}

function addToCart(id, variantName = '') {
    const product = getProduct(id);

    if (!product) return;

    const variant = getVariant(product, variantName);
    const selectedName = variant ? variant.name : '';
    const price = variant ? variant.price : product.price;

    const existingItem = cart.find(item =>
        item.id === product.id &&
        item.variantName === selectedName
    );

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.image,
            variantName: selectedName,
            price,
            qty: 1
        });
    }

    saveCart();
    updateCart();
    openCart();

    showToast(
        `${product.name}${selectedName ? ` (${selectedName})` : ''} ditambahkan ke keranjang! ♡`
    );
}

function updateQty(index, change) {
    const item = cart[index];

    if (!item) return;

    item.qty += change;

    if (item.qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}

function updateCart() {
    const items = $('#cartItems');
    const count = $('#cartCount');
    const total = $('#cartTotal');
    const empty = $('#cartEmpty');
    const footer = $('#cartFooter');

    if (count) {
        count.textContent = getTotalQuantity();
    }

    if (!items) return;

    if (cart.length === 0) {
        items.innerHTML = '';
        items.hidden = true;

        if (empty) empty.hidden = false;
        if (footer) footer.hidden = true;
        if (total) total.textContent = formatRupiah(0);

        return;
    }

    items.hidden = false;

    if (empty) empty.hidden = true;
    if (footer) footer.hidden = false;

    items.innerHTML = cart.map((item, index) => `
        <div class="cart-item">

            <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
                class="cart-item-img"
                loading="lazy"
            >

            <div class="cart-item-info">

                <div class="cart-item-title">
                    ${escapeHTML(item.name)}
                </div>

                ${
                    item.variantName
                        ? `<div class="cart-item-variant">Rasa: ${escapeHTML(item.variantName)}</div>`
                        : ''
                }

                <div class="cart-item-price">
                    ${formatRupiah(item.price * item.qty)}
                </div>

                <div class="cart-controls">

                    <button
                        class="qty-btn"
                        type="button"
                        data-qty="-1"
                        data-cart-index="${index}"
                    >−</button>

                    <span class="qty-number">${item.qty}</span>

                    <button
                        class="qty-btn"
                        type="button"
                        data-qty="1"
                        data-cart-index="${index}"
                    >+</button>

                </div>
            </div>
        </div>
    `).join('');

    items.querySelectorAll('.cart-item-img').forEach(img => {
        img.addEventListener('error', () => {
            img.hidden = true;
        }, { once: true });
    });

    if (total) {
        total.textContent = formatRupiah(getCartTotal());
    }
}

/* =========================================
   5. TAMPILAN MENU DAN VARIAN
   ========================================= */

let activeCategory = 'Semua';

function renderMenu() {
    const menuGrid = $('#menuGrid');

    if (!menuGrid) {
        console.error('Elemen #menuGrid tidak ditemukan.');
        return;
    }

    const searchInput = $('#searchInput');

    const search = searchInput
        ? searchInput.value.trim().toLowerCase()
        : '';

    const filteredItems = menuItems.filter(item => {
        const categoryMatch =
            activeCategory === 'Semua' ||
            item.category === activeCategory;

        const variants = Array.isArray(item.variants)
            ? item.variants.map(v => v.name).join(' ')
            : '';

        const searchText =
            `${item.name} ${item.description} ${variants}`.toLowerCase();

        return categoryMatch && searchText.includes(search);
    });

    menuGrid.innerHTML = filteredItems.map(item => {
        const hasVariants =
            Array.isArray(item.variants) &&
            item.variants.length > 0;

        const startingPrice = hasVariants
            ? item.variants[0].price
            : item.price;

        const variantSelector = hasVariants ? `
            <div class="menu-variant">

                <label
                    class="variant-label"
                    for="variant-${item.id}"
                >
                    Pilih rasa:
                </label>

                <select
                    class="variant-select"
                    id="variant-${item.id}"
                    data-variant-select="${item.id}"
                >
                    ${item.variants.map(variant => `
                        <option
                            value="${escapeHTML(variant.name)}"
                            data-price="${variant.price}"
                        >
                            ${escapeHTML(variant.name)} - ${formatRupiah(variant.price)}
                        </option>
                    `).join('')}
                </select>

            </div>
        ` : '';

        return `
            <article class="menu-card">

                <div class="menu-image-wrap">

                    <span class="menu-category">
                        ${escapeHTML(item.category)}
                    </span>

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                        class="menu-image"
                        loading="lazy"
                    >

                </div>

                <div class="menu-info">

                    <h3 class="menu-title">
                        ${escapeHTML(item.name)}
                    </h3>

                    <p class="menu-desc">
                        ${escapeHTML(item.description)}
                    </p>

                    ${variantSelector}

                    <div class="menu-bottom">

                        <span
                            class="menu-price"
                            data-menu-price="${item.id}"
                        >
                            ${formatRupiah(startingPrice)}
                        </span>

                        <button
                            class="add-to-cart"
                            type="button"
                            data-add="${item.id}"
                        >
                            + Keranjang
                        </button>

                    </div>
                </div>

            </article>
        `;
    }).join('');

    menuGrid.querySelectorAll('.menu-image').forEach(img => {
        img.addEventListener('error', () => {
            const wrapper = img.closest('.menu-image-wrap');

            if (wrapper) {
                wrapper.classList.add('image-missing');
            }

            img.remove();
        }, { once: true });
    });

    const emptyState = $('#emptyState');

    if (emptyState) {
        emptyState.hidden = filteredItems.length > 0;
    }
}

function handleVariantChange(event) {
    const select = event.target.closest('[data-variant-select]');

    if (!select) return;

    const option = select.options[select.selectedIndex];
    const price = Number(option.dataset.price);

    const card = select.closest('.menu-card');

    const priceElement = card
        ? card.querySelector('[data-menu-price]')
        : null;

    if (priceElement && Number.isFinite(price)) {
        priceElement.textContent = formatRupiah(price);
    }
}

function handleMenuClick(event) {
    const button = event.target.closest('[data-add]');

    if (!button) return;

    const card = button.closest('.menu-card');

    const variantSelect = card
        ? card.querySelector('[data-variant-select]')
        : null;

    const variantName = variantSelect
        ? variantSelect.value
        : '';

    addToCart(button.dataset.add, variantName);
}

/* =========================================
   6. MODAL DAN OVERLAY
   ========================================= */

const cartSidebar = $('#cartSidebar');
const pageOverlay = $('#pageOverlay');
const checkoutModal = $('#checkoutModal');
const successModal = $('#successModal');
const historyModal = $('#historyModal');

function showOverlay() {
    if (!pageOverlay) return;

    pageOverlay.hidden = false;

    requestAnimationFrame(() => {
        pageOverlay.classList.add('visible');
    });

    document.body.classList.add('modal-open');
}

function closePanelsWithoutOverlay() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
        cartSidebar.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    });
}

function hideOverlay() {
    if (!pageOverlay) {
        document.body.classList.remove('modal-open');
        return;
    }

    pageOverlay.classList.remove('visible');

    setTimeout(() => {
        const cartOpen =
            cartSidebar && cartSidebar.classList.contains('open');

        const modalOpen =
            document.querySelector('.modal.open');

        if (!cartOpen && !modalOpen) {
            pageOverlay.hidden = true;
            document.body.classList.remove('modal-open');
        }
    }, 240);
}

function closeAllPanels() {
    closePanelsWithoutOverlay();
    hideOverlay();
}

function openCart() {
    if (!cartSidebar) return;

    closePanelsWithoutOverlay();
    showOverlay();

    cartSidebar.classList.add('open');
    cartSidebar.setAttribute('aria-hidden', 'false');
}

function openModal(modal) {
    if (!modal) return;

    closePanelsWithoutOverlay();
    showOverlay();

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

/* =========================================
   7. FITUR LOKASI GPS
   ========================================= */

let selectedDeliveryLocation = null;

function setDeliveryLocationStatus(message, state = 'info') {
    const status = $('#deliveryLocationStatus');

    if (!status) return;

    status.textContent = message;
    status.dataset.state = state;
}

function renderDeliveryLocation() {
    const result = $('#deliveryLocationResult');
    const coordinates = $('#deliveryCoordinates');
    const mapLink = $('#deliveryMapLink');

    if (!selectedDeliveryLocation) {
        if (result) result.hidden = true;
        if (coordinates) coordinates.textContent = '';

        if (mapLink) {
            mapLink.href = '#';
        }

        return;
    }

    const latitude = selectedDeliveryLocation.latitude;
    const longitude = selectedDeliveryLocation.longitude;
    const accuracy = Math.round(
        selectedDeliveryLocation.accuracy
    );

    if (coordinates) {
        coordinates.textContent =
            `Koordinat: ${latitude}, ${longitude} (akurasi sekitar ${accuracy} meter)`;
    }

    if (mapLink) {
        mapLink.href = selectedDeliveryLocation.mapLink;
        mapLink.textContent = 'Lihat titik lokasi di Google Maps ↗';
    }

    if (result) {
        result.hidden = false;
    }
}

function resetDeliveryLocation() {
    selectedDeliveryLocation = null;

    renderDeliveryLocation();

    setDeliveryLocationStatus(
        'Lokasi belum dipilih. Tekan tombol untuk mengambil lokasi.',
        'info'
    );

    const button = $('#getCurrentLocation');

    if (button) {
        button.disabled = false;
        button.textContent = '📍 Gunakan Lokasi Saya';
    }
}

function updateDeliveryFields() {
    const methodInput = $('#deliveryMethod');
    const deliveryFields = $('#deliveryFields');

    const isDelivery =
        methodInput && methodInput.value === 'delivery';

    if (deliveryFields) {
        deliveryFields.hidden = !isDelivery;
    }

    if (!isDelivery) {
        resetDeliveryLocation();
    }
}

function requestDeliveryLocation() {
    const button = $('#getCurrentLocation');

    if (!navigator.geolocation) {
        setDeliveryLocationStatus(
            'Browser ini belum mendukung fitur lokasi. Coba gunakan browser lain.',
            'error'
        );
        return;
    }

    const isLocalhost = [
        'localhost',
        '127.0.0.1',
        '::1'
    ].includes(window.location.hostname);

    if (!window.isSecureContext && !isLocalhost) {
        setDeliveryLocationStatus(
            'Fitur lokasi memerlukan website HTTPS atau localhost. Jalankan melalui Live Server.',
            'error'
        );
        return;
    }

    if (button) {
        button.disabled = true;
        button.textContent = 'Mengambil lokasi...';
    }

    setDeliveryLocationStatus(
        'Sedang meminta izin dan mengambil lokasi perangkat...',
        'loading'
    );

    navigator.geolocation.getCurrentPosition(

        // Lokasi berhasil ditemukan
        position => {
            const latitude = Number(
                position.coords.latitude.toFixed(6)
            );

            const longitude = Number(
                position.coords.longitude.toFixed(6)
            );

            const accuracy =
                Number(position.coords.accuracy) || 0;

            const mapLink =
                `https://www.google.com/maps?q=${latitude},${longitude}`;

            selectedDeliveryLocation = {
                latitude,
                longitude,
                accuracy,
                mapLink,
                capturedAt: new Date().toISOString()
            };

            renderDeliveryLocation();

            setDeliveryLocationStatus(
                'Lokasi berhasil diambil! Periksa titiknya melalui Google Maps.',
                'success'
            );

            if (button) {
                button.disabled = false;
                button.textContent = '🔄 Ambil Ulang Lokasi';
            }
        },

        // Lokasi gagal ditemukan
        error => {
            let message =
                'Lokasi tidak berhasil diambil. Coba lagi.';

            if (error.code === error.PERMISSION_DENIED) {
                message =
                    'Izin lokasi ditolak. Izinkan akses lokasi pada pengaturan browser, lalu coba lagi.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                message =
                    'Informasi lokasi tidak tersedia. Periksa GPS atau koneksi perangkat.';
            } else if (error.code === error.TIMEOUT) {
                message =
                    'Pengambilan lokasi terlalu lama. Coba tekan tombol lagi.';
            }

            setDeliveryLocationStatus(message, 'error');

            if (button) {
                button.disabled = false;

                button.textContent = selectedDeliveryLocation
                    ? '🔄 Ambil Ulang Lokasi'
                    : '📍 Gunakan Lokasi Saya';
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
    );
}

function getDeliveryData(formData) {
    const method = formData.get('deliveryMethod');

    const landmark = String(
        formData.get('deliveryLandmark') || ''
    ).trim();

    if (method === 'pickup') {
        return {
            deliveryMethod: 'Ambil Sendiri',
            deliveryAddress: '-',
            deliveryLandmark: '-',
            deliveryMapLink: '-',
            deliveryLatitude: null,
            deliveryLongitude: null,
            deliveryAccuracy: null,
            deliveryLocationCapturedAt: null
        };
    }

    return {
        deliveryMethod: 'Diantar ke Alamat',
        deliveryAddress: landmark || 'Lokasi GPS pelanggan',
        deliveryLandmark: landmark || '-',

        deliveryMapLink: selectedDeliveryLocation
            ? selectedDeliveryLocation.mapLink
            : '-',

        deliveryLatitude: selectedDeliveryLocation
            ? selectedDeliveryLocation.latitude
            : null,

        deliveryLongitude: selectedDeliveryLocation
            ? selectedDeliveryLocation.longitude
            : null,

        deliveryAccuracy: selectedDeliveryLocation
            ? selectedDeliveryLocation.accuracy
            : null,

        deliveryLocationCapturedAt: selectedDeliveryLocation
            ? selectedDeliveryLocation.capturedAt
            : null
    };
}

/* =========================================
   8. CHECKOUT
   ========================================= */

let selectedProofFile = null;
let proofPreviewURL = null;
let lastOrder = null;

function clearProofPreview() {
    if (proofPreviewURL) {
        URL.revokeObjectURL(proofPreviewURL);
        proofPreviewURL = null;
    }
}

function showCheckout() {
    if (cart.length === 0) {
        showToast('Keranjang masih kosong!');
        return;
    }

    const summary = $('#checkoutSummary');

    if (summary) {
        summary.innerHTML = cart.map(item => `
            <div class="summary-line">
                <span>
                    ${escapeHTML(item.name)}
                    ${item.variantName
                        ? ` (${escapeHTML(item.variantName)})`
                        : ''}
                    × ${item.qty}
                </span>

                <strong>
                    ${formatRupiah(item.price * item.qty)}
                </strong>
            </div>
        `).join('');
    }

    const totalText = formatRupiah(getCartTotal());

    const checkoutTotal = $('#checkoutTotal');
    const qrisTotal = $('#qrisTotal');

    if (checkoutTotal) {
        checkoutTotal.textContent = totalText;
    }

    if (qrisTotal) {
        qrisTotal.textContent = totalText;
    }

    const form = $('#checkoutForm');

    if (form) {
        form.reset();
    }

    selectedProofFile = null;
    clearProofPreview();

    const preview = $('#proofPreview');

    if (preview) {
        preview.innerHTML = '';
    }

    resetDeliveryLocation();
    updateDeliveryFields();

    openModal(checkoutModal);
}

function getOrders() {
    const orders = loadData(ORDER_KEY, []);

    return Array.isArray(orders) ? orders : [];
}

/* =========================================
   9. RIWAYAT PESANAN
   ========================================= */

function renderHistory() {
    const container = $('#orderHistory');

    if (!container) return;

    const orders = getOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                Belum ada pesanan tersimpan. ♡
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => {
        const date = new Date(order.createdAt);

        const dateText = Number.isNaN(date.getTime())
            ? '-'
            : date.toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

        const itemsHTML = (order.items || []).map(item => `
            <div class="summary-line">
                <span>
                    ${escapeHTML(item.name)}
                    ${item.variantName
                        ? ` (${escapeHTML(item.variantName)})`
                        : ''}
                    × ${item.qty}
                </span>

                <strong>
                    ${formatRupiah(
                        (Number(item.price) || 0) *
                        (Number(item.qty) || 0)
                    )}
                </strong>
            </div>
        `).join('');

        const deliveryHTML =
            order.deliveryMethod === 'Diantar ke Alamat'
                ? `
                    <p>
                        Patokan:
                        ${escapeHTML(order.deliveryLandmark || '-')}
                    </p>

                    <p>
                        Koordinat GPS:
                        ${
                            order.deliveryLatitude != null &&
                            order.deliveryLongitude != null
                                ? `${escapeHTML(order.deliveryLatitude)}, ${escapeHTML(order.deliveryLongitude)}`
                                : '-'
                        }
                    </p>

                    ${
                        order.deliveryMapLink &&
                        order.deliveryMapLink !== '-'
                            ? `
                                <p>
                                    <a
                                        href="${escapeHTML(order.deliveryMapLink)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lihat lokasi di Google Maps ↗
                                    </a>
                                </p>
                            `
                            : ''
                    }
                `
                : `
                    <p>Metode penerimaan: Ambil Sendiri</p>
                `;

        const status = order.status ||
            'Menunggu Verifikasi';

        return `
            <article class="history-card">

                <div class="history-top">
                    <strong>${escapeHTML(order.id || '-')}</strong>
                    <time>${escapeHTML(dateText)}</time>
                </div>

                <p>
                    Nama: ${escapeHTML(order.customerName || '-')}
                </p>

                <p>
                    WhatsApp: ${escapeHTML(order.customerPhone || '-')}
                </p>

                <p>
                    Metode penerimaan:
                    ${escapeHTML(order.deliveryMethod || 'Ambil Sendiri')}
                </p>

                ${deliveryHTML}

                ${itemsHTML}

                <p>
                    Pembayaran:
                    ${escapeHTML(order.paymentMethod || 'QRIS')}
                </p>

                <p>
                    Status pembayaran:
                    <strong>${escapeHTML(status)}</strong>
                </p>

                ${
                    order.verificationNote
                        ? `
                            <p>
                                Catatan admin:
                                ${escapeHTML(order.verificationNote)}
                            </p>
                        `
                        : ''
                }

                <div class="history-total">
                    ${formatRupiah(order.total)}
                </div>

            </article>
        `;
    }).join('');
}

/* =========================================
   10. KIRIM DETAIL PESANAN KE WHATSAPP
   ========================================= */

function sendOrderToWhatsApp() {
    if (!lastOrder) {
        showToast('Pesanan tidak ditemukan!');
        return;
    }

    const orderLines = (lastOrder.items || []).map(item =>
        `- ${item.name}${item.variantName
            ? ` (${item.variantName})`
            : ''} x ${item.qty}`
    );

    const message = [
        'Halo Seoul Bites! Saya sudah membuat pesanan.',
        '',
        `Nomor pesanan: ${lastOrder.id}`,
        `Nama: ${lastOrder.customerName}`,
        `Nomor WhatsApp: ${lastOrder.customerPhone}`,
        `Metode penerimaan: ${lastOrder.deliveryMethod}`,

        ...(lastOrder.deliveryMethod === 'Diantar ke Alamat'
            ? [
                `Patokan: ${lastOrder.deliveryLandmark || '-'}`,

                `Koordinat GPS: ${
                    lastOrder.deliveryLatitude != null &&
                    lastOrder.deliveryLongitude != null
                        ? `${lastOrder.deliveryLatitude}, ${lastOrder.deliveryLongitude}`
                        : '-'
                }`,

                `Lokasi Google Maps: ${lastOrder.deliveryMapLink || '-'}`,

                'Ongkos kirim dikonfirmasi oleh penjual.'
            ]
            : []
        ),

        `Catatan: ${lastOrder.note || '-'}`,
        '',

        'Pesanan:',
        ...orderLines,
        '',

        `Total: ${formatRupiah(lastOrder.total)}`,
        'Pembayaran: QRIS',
        'Status: Menunggu Verifikasi',
        '',

        'Saya akan melampirkan foto bukti pembayaran jika diperlukan.',
        'Terima kasih!'
    ].join('\n');

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(
        whatsappURL,
        '_blank',
        'noopener,noreferrer'
    );

    showToast(
        'Lampirkan foto bukti pembayaran di WhatsApp, ya!'
    );
}

/* =========================================
   11. INISIALISASI WEBSITE
   ========================================= */

function initSeoulBites() {

    /* MENU */

    const menuGrid = $('#menuGrid');

    if (menuGrid) {
        menuGrid.addEventListener('click', handleMenuClick);
        menuGrid.addEventListener('change', handleVariantChange);
    }

    const searchInput = $('#searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', renderMenu);
    }

    const categoryFilters = $('#categoryFilters');

    if (categoryFilters) {
        categoryFilters.addEventListener('click', event => {
            const button = event.target.closest('[data-category]');

            if (!button) return;

            activeCategory = button.dataset.category;

            document.querySelectorAll('.filter-chip').forEach(chip => {
                chip.classList.toggle('active', chip === button);
            });

            renderMenu();
        });
    }

    /* KERANJANG */

    const cartButton = $('#cartButton');

    if (cartButton) {
        cartButton.addEventListener('click', openCart);
    }

    const closeCartButton = $('#closeCartButton');

    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeAllPanels);
    }

    const overlay = $('#pageOverlay');

    if (overlay) {
        overlay.addEventListener('click', closeAllPanels);
    }

    const cartItemsElement = $('#cartItems');

    if (cartItemsElement) {
        cartItemsElement.addEventListener('click', event => {
            const button = event.target.closest('[data-qty]');

            if (!button) return;

            updateQty(
                Number(button.dataset.cartIndex),
                Number(button.dataset.qty)
            );
        });
    }

    const checkoutButton = $('#checkoutButton');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', showCheckout);
    }

    /* TUTUP MODAL */

    document.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', closeAllPanels);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeAllPanels();
        }
    });

    /* METODE PENERIMAAN PESANAN */

    const deliveryMethodInput = $('#deliveryMethod');

    if (deliveryMethodInput) {
        deliveryMethodInput.addEventListener(
            'change',
            updateDeliveryFields
        );

        updateDeliveryFields();
    }

    /* TOMBOL GPS */

    const getCurrentLocationButton = $('#getCurrentLocation');

    if (getCurrentLocationButton) {
        getCurrentLocationButton.addEventListener(
            'click',
            requestDeliveryLocation
        );
    }

    /* FORM CHECKOUT */

    const checkoutForm = $('#checkoutForm');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async event => {
            event.preventDefault();

            if (cart.length === 0) {
                showToast('Keranjang masih kosong!');
                return;
            }

            if (!checkoutForm.reportValidity()) {
                return;
            }

            if (!selectedProofFile) {
                showToast('Upload bukti pembayaran terlebih dahulu!');
                return;
            }

            const formData = new FormData(checkoutForm);
            const deliveryData = getDeliveryData(formData);

            // Pengantaran wajib mengambil lokasi GPS
            if (
                deliveryData.deliveryMethod === 'Diantar ke Alamat' &&
                !selectedDeliveryLocation
            ) {
                showToast('Ambil lokasi GPS terlebih dahulu!');

                const locationButton = $('#getCurrentLocation');

                if (locationButton) {
                    locationButton.focus();
                }

                return;
            }

            const submitButton =
                checkoutForm.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Menyimpan pesanan...';
            }

            try {
                const order = {
                    id: `SB-${Date.now().toString().slice(-8)}`,
                    createdAt: new Date().toISOString(),

                    customerName: String(
                        formData.get('customerName') || ''
                    ).trim(),

                    customerPhone: String(
                        formData.get('customerPhone') || ''
                    ).trim(),

                    deliveryMethod: deliveryData.deliveryMethod,
                    deliveryAddress: deliveryData.deliveryAddress,
                    deliveryLandmark: deliveryData.deliveryLandmark,
                    deliveryMapLink: deliveryData.deliveryMapLink,

                    deliveryLatitude: deliveryData.deliveryLatitude,
                    deliveryLongitude: deliveryData.deliveryLongitude,
                    deliveryAccuracy: deliveryData.deliveryAccuracy,

                    deliveryLocationCapturedAt:
                        deliveryData.deliveryLocationCapturedAt,

                    // Menjaga kompatibilitas riwayat lama
                    customerAddress: deliveryData.deliveryAddress,

                    note: String(
                        formData.get('orderNote') || ''
                    ).trim(),

                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        variantName: item.variantName || '',
                        price: item.price,
                        qty: item.qty,
                        image: item.image
                    })),

                    total: getCartTotal(),
                    paymentMethod: 'QRIS',
                    proofFileName: selectedProofFile.name,

                    status: 'Menunggu Verifikasi',
                    verificationNote: '',
                    verifiedAt: null
                };

                // Simpan gambar bukti ke IndexedDB
                await saveProofFile(order.id, selectedProofFile);

                // Simpan informasi pesanan
                const orders = getOrders();
                orders.unshift(order);

                if (!saveData(ORDER_KEY, orders)) {
                    throw new Error('Pesanan gagal disimpan.');
                }

                lastOrder = order;

                cart = [];

                if (!saveCart()) {
                    throw new Error('Keranjang gagal diperbarui.');
                }

                updateCart();

                const successMessage = $('#successMessage');

                if (successMessage) {
                    successMessage.textContent =
                        `Pesanan ${order.id} berhasil dicatat. Menunggu verifikasi pembayaran.`;
                }

                checkoutForm.reset();

                selectedDeliveryLocation = null;
                updateDeliveryFields();
                renderDeliveryLocation();

                const preview = $('#proofPreview');

                if (preview) {
                    preview.innerHTML = '';
                }

                selectedProofFile = null;
                clearProofPreview();

                closeAllPanels();
                openModal(successModal);

                showToast('Pesanan berhasil dicatat! 💗');

            } catch (error) {
                console.error('Gagal menyimpan pesanan:', error);

                showToast(
                    'Pesanan gagal disimpan. Coba kembali.'
                );

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Simpan Pesanan →';
                }
            }
        });
    }

    /* UPLOAD BUKTI PEMBAYARAN */

    const paymentProofInput = $('#paymentProof');

    if (paymentProofInput) {
        paymentProofInput.addEventListener('change', event => {
            const file =
                event.target.files && event.target.files[0];

            selectedProofFile = null;
            clearProofPreview();

            const preview = $('#proofPreview');

            if (preview) {
                preview.innerHTML = '';
            }

            if (!file) return;

            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp'
            ];

            if (!allowedTypes.includes(file.type)) {
                event.target.value = '';
                showToast('Pilih gambar JPG, PNG, atau WEBP.');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                event.target.value = '';
                showToast('Ukuran gambar maksimal 5 MB!');
                return;
            }

            selectedProofFile = file;
            proofPreviewURL = URL.createObjectURL(file);

            if (preview) {
                const image = document.createElement('img');

                image.src = proofPreviewURL;
                image.alt = 'Pratinjau bukti pembayaran';

                const text = document.createElement('p');

                text.textContent = `File dipilih: ${file.name}`;

                preview.append(image, text);
            }
        });
    }

    /* QRIS */

    const qrisImage = $('#qrisImage');
    const qrisFallback = $('#qrisFallback');

    if (qrisImage) {
        qrisImage.addEventListener('error', () => {
            qrisImage.hidden = true;

            if (qrisFallback) {
                qrisFallback.hidden = false;
            }
        });

        qrisImage.addEventListener('load', () => {
            qrisImage.hidden = false;

            if (qrisFallback) {
                qrisFallback.hidden = true;
            }
        });
    }

    /* RIWAYAT PESANAN */

    const historyButton = $('#historyButton');

    if (historyButton) {
        historyButton.addEventListener('click', () => {
            renderHistory();
            openModal(historyModal);
        });
    }

    /* WHATSAPP */

    const sendProofButton = $('#sendProofButton');

    if (sendProofButton) {
        sendProofButton.addEventListener(
            'click',
            sendOrderToWhatsApp
        );
    }

    /* TOMBOL LIHAT MENU */

    const browseMenuButton = $('#browseMenuButton');

    if (browseMenuButton) {
        browseMenuButton.addEventListener('click', () => {
            closeAllPanels();

            const menuSection = $('#menu');

            if (menuSection) {
                menuSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    /* TOMBOL SELESAI */

    const successDoneButton = $('#successDoneButton');

    if (successDoneButton) {
        successDoneButton.addEventListener(
            'click',
            closeAllPanels
        );
    }

    /* TAHUN FOOTER */

    const currentYear = $('#currentYear');

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Perbarui riwayat saat admin mengubah status di tab lain
    window.addEventListener('storage', event => {
        if (
            event.key === ORDER_KEY &&
            historyModal &&
            historyModal.classList.contains('open')
        ) {
            renderHistory();
        }
    });

    /* TAMPILKAN MENU DAN KERANJANG */

    renderMenu();
    updateCart();

    console.log('Seoul Bites berhasil dijalankan! 💗');
}

/* =========================================
   12. JALANKAN WEBSITE
   ========================================= */

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initSeoulBites,
        { once: true }
    );
} else {
    initSeoulBites();
}
