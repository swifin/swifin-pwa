// ~/swifin-pwa/pages/api/swifin/load-profile.js

import { encrypt } from '@/lib/crypto';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { swifinId, swifinPassword } = req.body;

  if (!swifinId || !swifinPassword) {
    return res.status(400).json({ error: 'Swifin ID and Password are required.' });
  }

  try {
    const auth = Buffer.from(`${swifinId}:${swifinPassword}`).toString('base64');

    const response = await fetch('https://api.swifin.com/rest/members/me', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid Swifin ID or Password' });
    }

    const data = await response.json();

    const encryptedId = encrypt(swifinId);
    const encryptedPass = encrypt(swifinPassword);

    res.setHeader('Set-Cookie', [
      cookie.serialize('swifinId', encryptedId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
      cookie.serialize('swifinPassword', encryptedPass, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }),
    ]);

    return res.status(200).json({ profile: data });

  } catch (err) {
    console.error('[load-profile] Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

