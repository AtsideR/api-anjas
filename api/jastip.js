// Lightweight Vercel function for /api/jastip
// This handler avoids mounting a full Express app to reduce cold-start latency.
const Jastip = require('../src/models/jastipModel');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const result = await Jastip.getAll();
      const data = result.data || null;
      const error = result.error || null;
      if (error) {
        console.error('Supabase error (getAll jastip):', error);
        return res.status(500).json({ error });
      }
      return res.status(200).json(data);
    }

    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error('Unhandled error in /api/jastip:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
