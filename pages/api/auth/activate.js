// pages/api/auth/activate.js

import axios from 'axios';
import jwt from 'jsonwebtoken';

const SWIFIN_API_URL = process.env.SWIFIN_API_URL || 'https://your-legacy-swifin-api.com';
const JWT_SECRET = process.env.JWT_SECRET || 'swifin-super-secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { swifinId, password } = req.body;

  if (!swifinId || !password) {
    return res.status(400).json({ error: 'Swifin ID and password required' });
  }

  try {
    // 1. ✅ Authenticate with the legacy Swifin Core
    const { data: legacyUser } = await axios.post(`${SWIFIN_API_URL}/login`, {
      principal: swifinId,
      password,
    });

    if (!legacyUser || !legacyUser.member) {
      return res.status(401).json({ error: 'Invalid Swifin credentials' });
    }

    // 2. 🎯 Extract core user info
    const { name, email, phone } = legacyUser.member;

    // 3. 🔐 Generate JWT (you can adjust expiration)
    const token = jwt.sign(
      {
        swifinId,
        name,
        email,
        phone,
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 4. 🪙 Ensure wallet exists on Polygon (to be handled in future integration)
    // e.g., await createPolygonWallet(swifinId);

    // 5. 🎯 Return successful response
    return res.status(200).json({
      success: true,
      user: {
        swifinId,
        name,
        email,
        phone,
      },
      token,
    });

  } catch (err) {
    console.error('Activation error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Swifin core API error or unreachable.' });
  }
}
