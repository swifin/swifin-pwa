// /pages/api/swifin/login.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { swifinId, password } = req.body;

  if (!swifinId || !password) {
    return res.status(400).json({ message: 'Swifin ID and password are required' });
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SWIFIN_API_URL}/members/current`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${swifinId}:${password}`).toString('base64'),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message || 'Invalid Swifin ID or Password' });
    }

    const profile = await response.json();

    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

