// pages/api/admin/kyc-action.js
import { db } from '../../../lib/db'; // Example DB connector, adjust if different

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        kycStatus: action === 'approve' ? 'approved' : 'rejected',
      },
    });

    return res.status(200).json({ message: `User ${action}d successfully` });
  } catch (error) {
    console.error('Failed to update KYC status:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}
