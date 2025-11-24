// Lightweight Vercel function for /api/anjem
// This handler avoids mounting a full Express app to reduce cold-start latency.
const Anjem = require('../src/models/anjemModel');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // GET /api/anjem -> list all
      const result = await Anjem.getAll();
      // Supabase returns { data, error }
      const data = result.data || null;
      const error = result.error || null;
      if (error) {
        console.error('Supabase error (getAll):', error);
        return res.status(500).json({ error });
      }
      return res.status(200).json(data);
    }

    // Not allowed
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error('Unhandled error in /api/anjem:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
