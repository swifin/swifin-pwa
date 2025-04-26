// pages/api/admin/get-kyc-submissions.js
import { getServerSession } from 'next-auth';
import { getAllKycSubmissions, updateKycStatus, saveKycSubmission } from '../../lib/db'; // Example DB connector, adjust if different

export default async function handler(req, res) {
  // OPTIONAL: Secure this route with Admin Session (future)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pendingUsers = await db.user.findMany({
      where: { kycStatus: 'pending' },
      select: {
        id: true,
        name: true,
        email: true,
        mobilePhone: true,
        selfie: true,
        idDoc: true,
      },
    });

    return res.status(200).json({ users: pendingUsers });
  } catch (error) {
    console.error('Failed to load KYC submissions:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}
