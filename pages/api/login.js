export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { swifinId, password } = req.body;

  if (!swifinId || !password) {
    return res.status(400).json({ message: 'Swifin ID and Password are required' });
  }

  const credentials = Buffer.from(`${swifinId}:${password}`).toString('base64');

  try {
    const response = await fetch('https://api.swifin.com/rest/members/me', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(401).json({ message: 'Invalid Swifin ID or Password' });
    }

    const profile = await response.json();
    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
