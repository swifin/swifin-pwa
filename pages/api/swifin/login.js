// pages/api/swifin/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { swifinID, password } = req.body;

  try {
    const authHeader = Buffer.from(`${swifinID}:${password}`).toString('base64');

    const response = await fetch(process.env.SWIFIN_REST_API, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(401).json({ message: 'Invalid Swifin ID or Password' });
    }

    const user = await response.json();
    res.status(200).json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}
