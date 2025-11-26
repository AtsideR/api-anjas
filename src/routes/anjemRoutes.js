// routes/anjemRoutes.js
const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// GET semua data
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("anjem").select("*");

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// POST tambah data
router.post("/", async (req, res) => {
  const payload = req.body;

  // VALIDASI AGAR TIDAK ERROR BIGINT
  if (payload.id && isNaN(Number(payload.id))) {
    return res.status(400).json({ error: "ID harus berupa angka" });
  }

  const { data, error } = await supabase.from("anjem").insert([payload]);

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// GET berdasarkan ID
router.get("/id/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID harus angka" });
  }

  const { data, error } = await supabase
    .from("anjem")
    .select("*")
    .eq("id", id);

  if (error) return res.status(500).json({ error });
  res.json(data);
});

module.exports = router;
