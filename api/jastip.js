// Lightweight Vercel function for /api/jastip
// This handler avoids mounting a full Express app to reduce cold-start latency.
const Jastip = require('../src/models/jastipModel');

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return await new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (chunk) => (buf += chunk));
    req.on('end', () => {
      if (!buf) return resolve(null);
      try {
        resolve(JSON.parse(buf));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // Simple CORS for browser frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    const parts = (req.url || '').split('/').filter(Boolean);

    if (req.method === 'GET') {
      if (parts.length >= 1) {
        const id = parts[0];
        const result = await Jastip.getById(id);
        const data = result.data || null;
        const error = result.error || null;
        if (error) return res.status(404).json({ error });
        return res.status(200).json(data);
      }

      const result = await Jastip.getAll();
      const data = result.data || null;
      const error = result.error || null;
      if (error) return res.status(500).json({ error });
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const payload = await parseJsonBody(req).catch((e) => {
        console.error('Invalid JSON body:', e.message);
        return null;
      });
      if (!payload || (typeof payload === 'object' && Object.keys(payload).length === 0)) {
        return res.status(400).json({ error: 'Request body is required' });
      }

      const result = await Jastip.create(payload);
      const data = result.data || null;
      const error = result.error || null;
      if (error) return res.status(400).json({ error });
      return res.status(201).json(data);
    }

    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error('Unhandled error in /api/jastip:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
