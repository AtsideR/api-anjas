// Vercel function for /api/jastip
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const jastipRoutes = require('../src/routes/jastipRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Mount existing router at root so Vercel's /api/jastip maps to router's '/'
app.use('/', jastipRoutes);

// JSON parse error handler
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', err.message);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

module.exports = serverless(app);
