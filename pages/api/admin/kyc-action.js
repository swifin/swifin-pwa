import { updateKycStatus } from '../../../lib/db'; // not getAllKycSubmissions

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    await updateKycStatus(userId, action);

    return res.status(200).json({ message: `User ${action}d successfully` });
  } catch (error) {
    console.error('Failed to update KYC status:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

