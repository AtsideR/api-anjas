// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const anjemRoutes = require("./routes/anjemRoutes");
const jastipRoutes = require("./routes/jastipRoutes");

// HOME
app.get("/", (req, res) => {
  res.send("API Anjem & Jastip Running 🚀");
});

// STATIC ROUTES — AMAN UNTUK VERCEL
app.use("/api/anjem", anjemRoutes);
app.use("/api/jastip", jastipRoutes);

// JSON parse error handler
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON received:", err.message);
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  next(err);
});

// LOCAL RUN
app.listen(3000, () => console.log("Server running on port 3000"));

// EXPORT FOR VERCEL
module.exports = app;
