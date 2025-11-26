require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// --- SETUP ---
app.use(cors());
app.use(express.json());

// --- ROUTE IMPORTS ---
// PENTING: Karena file ini ada di dalam folder 'api/',
// kita harus mundur satu folder (../) untuk mengakses folder 'routes'
// Asumsi struktur folder:
// root/
//   ├── api/index.js
//   ├── routes/
//   │     ├── anjemRoutes.js
//   │     └── jastipRoutes.js
try {
    const anjemRoutes = require("../routes/anjemRoutes");
    const jastipRoutes = require("../routes/jastipRoutes");

    app.use("/api/anjem", anjemRoutes);
    app.use("/api/jastip", jastipRoutes);
} catch (error) {
    console.error("Gagal memuat routes. Pastikan path '../routes/...' benar:", error.message);
}

// --- BASE ROUTE ---
app.get("/", (req, res) => {
    res.json({
        status: "Running",
        message: "API Anjem & Jastip Ready 🚀",
        endpoints: {
            anjem: "/api/anjem",
            jastip: "/api/jastip"
        }
    });
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
    if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Invalid JSON received:', err.message);
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
    next(err);
});

// --- SERVER LISTENER ---
// Logika ini penting untuk Vercel!
// Kita hanya jalankan .listen() jika file ini dijalankan secara lokal (node api/index.js).
// Saat di Vercel, Vercel yang akan menangani listening-nya, jadi kita hanya export app.
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;