"use strict";

require("dotenv").config();

const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const DATA_DIR = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(ROOT, "data");

const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const sessions = new Map();
const failedLogins = new Map();

let writeQueue = Promise.resolve();

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error(
        "ADMIN_USERNAME dan ADMIN_PASSWORD wajib diatur di file .env."
    );
    process.exit(1);
}

app.disable("x-powered-by");

app.use(express.json({
    limit: "1mb"
}));

/* =========================================
   1. FUNGSI DASAR SERVER
========================================= */

function safeEqual(a, b) {
    const left = Buffer.from(String(a));
    const right = Buffer.from(String(b));

    return (
        left.length === right.length &&
        crypto.timingSafeEqual(left, right)
    );
}

function cleanText(value, maxLength = 300) {
    return String(value ?? "")
        .trim()
        .slice(0, maxLength);
}

/* =========================================
   2. PENYIMPANAN DATA PESANAN
========================================= */

async function ensureStorage() {
    await fs.mkdir(DATA_DIR, {
        recursive: true
    });

    try {
        await fs.access(ORDERS_FILE);
    } catch {
        await fs.writeFile(
            ORDERS_FILE,
            "[]\n",
            "utf8"
        );
    }
}

async function readOrdersFile() {
    await ensureStorage();

    const raw = await fs.readFile(
        ORDERS_FILE,
        "utf8"
    );

    const parsed = JSON.parse(raw || "[]");

    return Array.isArray(parsed) ? parsed : [];
}

async function readOrders() {
    await writeQueue;
    return readOrdersFile();
}

async function writeOrders(orders) {
    await ensureStorage();

    const tempFile =
        `${ORDERS_FILE}.${process.pid}.tmp`;

    await fs.writeFile(
        tempFile,
        JSON.stringify(orders, null, 2),
        "utf8"
    );

    await fs.rename(tempFile, ORDERS_FILE);
}

function updateOrders(mutator) {
    const operation = writeQueue.then(async () => {
        const orders = await readOrdersFile();

        const result = await mutator(orders);

        await writeOrders(orders);

        return result;
    });

    writeQueue = operation.catch(() => {});

    return operation;
}

/* =========================================
   3. AUTENTIKASI ADMIN
========================================= */

function requireAdmin(req, res, next) {
    const authorization =
        req.get("authorization") || "";

    const token = authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : "";

    const expiresAt = sessions.get(token);

    if (
        !token ||
        !expiresAt ||
        expiresAt < Date.now()
    ) {
        if (token) {
            sessions.delete(token);
        }

        return res.status(401).json({
            message:
                "Sesi admin berakhir. Silakan login kembali."
        });
    }

    next();
}

/* =========================================
   4. MEMBUAT NOMOR PESANAN
========================================= */

function makeOrderId() {
    const datePart =
        Date.now().toString().slice(-8);

    const randomPart =
        crypto.randomBytes(2)
            .toString("hex")
            .toUpperCase();

    return `SB-${datePart}-${randomPart}`;
}

/* =========================================
   5. MEMERIKSA DATA PESANAN
========================================= */

function normalizeOrder(body) {
    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        throw new Error(
            "Format pesanan tidak valid."
        );
    }

    const customerName =
        cleanText(body.customerName, 100);

    const customerPhone =
        cleanText(body.customerPhone, 30);

    if (!customerName || !customerPhone) {
        throw new Error(
            "Nama dan nomor WhatsApp wajib diisi."
        );
    }

    if (
        !Array.isArray(body.items) ||
        body.items.length < 1 ||
        body.items.length > 50
    ) {
        throw new Error(
            "Rincian menu pesanan tidak valid."
        );
    }

    const items = body.items.map(item => {
        if (
            !item ||
            typeof item !== "object" ||
            Array.isArray(item)
        ) {
            throw new Error(
                "Rincian produk tidak valid."
            );
        }

        const price = Number(item.price);
        const qty = Number(item.qty);

        if (
            !Number.isFinite(price) ||
            price < 0 ||
            price > 10000000 ||
            !Number.isInteger(qty) ||
            qty < 1 ||
            qty > 99
        ) {
            throw new Error(
                "Harga atau jumlah menu tidak valid."
            );
        }

        return {
            id: cleanText(item.id, 40),
            name: cleanText(item.name, 120),
            variantName: cleanText(
                item.variantName,
                80
            ),
            price,
            qty,
            image: cleanText(item.image, 250)
        };
    });

    const total = items.reduce(
        (sum, item) =>
            sum + item.price * item.qty,
        0
    );

    const deliveryMethod =
        cleanText(body.deliveryMethod, 60);

    if (
        ![
            "Ambil Sendiri",
            "Diantar ke Alamat"
        ].includes(deliveryMethod)
    ) {
        throw new Error(
            "Metode penerimaan pesanan tidak valid."
        );
    }

    return {
        id: makeOrderId(),

        createdAt: new Date().toISOString(),

        customerName,
        customerPhone,

        deliveryMethod,

        deliveryAddress: cleanText(
            body.deliveryAddress,
            500
        ),

        deliveryLandmark: cleanText(
            body.deliveryLandmark,
            300
        ),

        deliveryMapLink: cleanText(
            body.deliveryMapLink,
            1000
        ),

        deliveryLatitude:
            body.deliveryLatitude == null ||
            body.deliveryLatitude === ""
                ? null
                : (
                    Number.isFinite(
                        Number(body.deliveryLatitude)
                    )
                        ? Number(body.deliveryLatitude)
                        : null
                ),

        deliveryLongitude:
            body.deliveryLongitude == null ||
            body.deliveryLongitude === ""
                ? null
                : (
                    Number.isFinite(
                        Number(body.deliveryLongitude)
                    )
                        ? Number(body.deliveryLongitude)
                        : null
                ),

        deliveryAccuracy:
            body.deliveryAccuracy == null ||
            body.deliveryAccuracy === ""
                ? null
                : (
                    Number.isFinite(
                        Number(body.deliveryAccuracy)
                    )
                        ? Number(body.deliveryAccuracy)
                        : null
                ),

        deliveryLocationCapturedAt: cleanText(
            body.deliveryLocationCapturedAt,
            80
        ),

        customerAddress: cleanText(
            body.customerAddress ||
            body.deliveryAddress,
            500
        ),

        note: cleanText(body.note, 1000),

        items,

        total,

        paymentMethod: "QRIS",

        proofFileName: cleanText(
            body.proofFileName,
            180
        ),

        status: "Menunggu Verifikasi",

        verificationNote: "",

        verifiedAt: null,

        rejectionReason: ""
    };
}

/* =========================================
   6. API STATUS SERVER
========================================= */

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "Seoul Bites API"
    });
});

/* =========================================
   7. CUSTOMER MENGIRIM PESANAN
========================================= */

app.post("/api/orders", async (req, res) => {
    try {
        const order = normalizeOrder(req.body);

        await updateOrders(orders => {
            orders.unshift(order);
            return order;
        });

        res.status(201).json({
            message: "Pesanan berhasil dicatat.",
            order
        });

    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        res.status(400).json({
            message:
                error.message ||
                "Pesanan gagal disimpan."
        });
    }
});

/* =========================================
   8. LOGIN ADMIN
========================================= */

app.post("/api/admin/login", (req, res) => {
    const ip = req.ip || "unknown";

    const attempt = failedLogins.get(ip) || {
        count: 0,
        resetAt: Date.now() + 15 * 60 * 1000
    };

    if (attempt.resetAt < Date.now()) {
        attempt.count = 0;
        attempt.resetAt =
            Date.now() + 15 * 60 * 1000;
    }

    if (attempt.count >= 10) {
        return res.status(429).json({
            message:
                "Terlalu banyak percobaan login. Coba lagi nanti."
        });
    }

    const usernameOk = safeEqual(
        req.body?.username || "",
        ADMIN_USERNAME
    );

    const passwordOk = safeEqual(
        req.body?.password || "",
        ADMIN_PASSWORD
    );

    if (!usernameOk || !passwordOk) {
        attempt.count += 1;
        failedLogins.set(ip, attempt);

        return res.status(401).json({
            message:
                "Username atau password salah."
        });
    }

    failedLogins.delete(ip);

    const token = crypto
        .randomBytes(32)
        .toString("hex");

    sessions.set(
        token,
        Date.now() + SESSION_TTL_MS
    );

    res.json({
        token,
        expiresIn: SESSION_TTL_MS
    });
});

/* =========================================
   9. ADMIN MELIHAT SEMUA PESANAN
========================================= */

app.get(
    "/api/admin/orders",
    requireAdmin,
    async (req, res) => {
        try {
            const orders = await readOrders();

            orders.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

            res.json({ orders });

        } catch (error) {
            console.error(
                "Read orders error:",
                error
            );

            res.status(500).json({
                message:
                    "Data pesanan gagal dibaca dari server."
            });
        }
    }
);

/* =========================================
   10. ADMIN MENERIMA ATAU MENOLAK PEMBAYARAN
========================================= */

app.patch(
    "/api/admin/orders/:id/status",
    requireAdmin,
    async (req, res) => {
        try {
            const status = cleanText(
                req.body?.status,
                60
            );

            const reason = cleanText(
                req.body?.reason,
                500
            );

            if (
                ![
                    "Pembayaran Diterima",
                    "Pembayaran Ditolak"
                ].includes(status)
            ) {
                return res.status(400).json({
                    message:
                        "Status pembayaran tidak valid."
                });
            }

            if (
                status === "Pembayaran Ditolak" &&
                !reason
            ) {
                return res.status(400).json({
                    message:
                        "Alasan penolakan wajib diisi."
                });
            }

            const updated = await updateOrders(
                orders => {
                    const order = orders.find(
                        item =>
                            String(item.id) ===
                            String(req.params.id)
                    );

                    if (!order) {
                        return {
                            error:
                                "Pesanan tidak ditemukan.",
                            code: 404
                        };
                    }

                    if (
                        order.status !==
                        "Menunggu Verifikasi"
                    ) {
                        return {
                            error:
                                "Pesanan ini sudah diverifikasi.",
                            code: 409
                        };
                    }

                    order.status = status;

                    order.verifiedAt =
                        new Date().toISOString();

                    order.verificationNote =
                        status === "Pembayaran Ditolak"
                            ? reason
                            : "";

                    order.rejectionReason =
                        status === "Pembayaran Ditolak"
                            ? reason
                            : "";

                    return { order };
                }
            );

            if (updated.error) {
                return res.status(updated.code).json({
                    message: updated.error
                });
            }

            res.json({
                message:
                    "Status pesanan berhasil diperbarui.",
                order: updated.order
            });

        } catch (error) {
            console.error(
                "Update status error:",
                error
            );

            res.status(500).json({
                message:
                    "Status pesanan gagal diperbarui."
            });
        }
    }
);

/* =========================================
   11. MELINDUNGI FILE SERVER
========================================= */

app.use(
    [
        "/data",
        "/node_modules",
        "/server.js",
        "/package.json",
        "/package-lock.json",
        "/.env"
    ],
    (req, res) => {
        res.sendStatus(404);
    }
);

/* =========================================
   12. MENAMPILKAN WEBSITE
========================================= */

app.use(
    express.static(ROOT, {
        dotfiles: "deny",
        index: "index.html"
    })
);

app.use((req, res) => {
    res.status(404).send(
        "Halaman tidak ditemukan."
    );
});

/* =========================================
   13. MENJALANKAN SERVER
========================================= */

ensureStorage()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(
                `Seoul Bites berjalan di http://localhost:${PORT}`
            );

            console.log(
                `Penyimpanan pesanan: ${ORDERS_FILE}`
            );
        });
    })
    .catch(error => {
        console.error(
            "Gagal menyiapkan penyimpanan:",
            error
        );

        process.exit(1);
    });