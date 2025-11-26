const express = require('express');
const cors = require('cors');
// Pastikan konfigurasi database Anda sudah benar di file terpisah atau disesuaikan disini
// const pool = require('../db'); // Contoh import koneksi database

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// BAGIAN 1: ROUTE STATIS (WAJIB DI ATAS)
// ==========================================

// Route Home
app.get('/', (req, res) => {
    res.json({
        message: "Server is running!",
        routes: {
            api: "/api",
            detail: "/api/:id"
        }
    });
});

// Route /api (Ini yang sebelumnya menyebabkan error karena dianggap ID)
app.get('/api', (req, res) => {
    res.json({
        status: "success",
        message: "Welcome to API Anjas. Use /api/<id> to get data."
    });
});

// Route pencarian atau statis lainnya (misal: /api/search)
app.get('/api/search', (req, res) => {
    res.json({ message: "Search route is working" });
});


// ==========================================
// BAGIAN 2: ROUTE DINAMIS (WAJIB DI BAWAH)
// ==========================================

// Route untuk mengambil data berdasarkan ID
app.get('/api/:id', async (req, res) => {
    const { id } = req.params;

    // --- FIX UTAMA: Validasi Input ---
    // Cek apakah 'id' adalah angka. Jika bukan, stop proses.
    // Ini mencegah error "invalid input syntax for type bigint"
    if (isNaN(id)) {
        return res.status(400).json({
            error: "Invalid Parameter",
            message: `ID harus berupa angka. Anda mengirim: '${id}'`
        });
    }

    try {
        // Contoh query database (sesuaikan dengan nama tabel Anda)
        // const query = 'SELECT * FROM users WHERE id = $1';
        // const result = await pool.query(query, [id]);
        
        // if (result.rows.length === 0) {
        //     return res.status(404).json({ error: "Data not found" });
        // }
        // res.json(result.rows[0]);

        // Mock response (Hapus ini jika sudah connect DB)
        res.json({
            id: id,
            name: "Contoh Data dari Database",
            description: "Data berhasil diambil karena ID valid."
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Jalankan Server (Local development)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Penting untuk Vercel