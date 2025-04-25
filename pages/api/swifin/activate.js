// pages/api/swifin/activate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { swifinId, swifinPassword } = req.body;

  if (!swifinId || !swifinPassword) {
    return res.status(400).json({ error: 'Missing Swifin ID or Password' });
  }

  const encodedAuth = Buffer.from(`${swifinId}:${swifinPassword}`).toString('base64');

  try {
    const response = await fetch('https://api.swifin.com/rest/members/me', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to retrieve profile. Check Swifin credentials.' });
    }

    const userData = await response.json();
    return res.status(200).json({ profile: userData });

  } catch (err) {
    console.error('Swifin API error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
