// pages/admin/kyc-action.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function KycActionPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: fetch KYC submissions (you need an API endpoint for this)
    const fetchKycSubmissions = async () => {
      try {
        const res = await axios.get('/api/admin/get-kyc-submissions'); // Create this API if needed
        setSubmissions(res.data.submissions || []);
      } catch (error) {
        console.error('Failed to load submissions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKycSubmissions();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      await axios.post('/api/admin/kyc-action', { userId, action });
      alert(`User ${action}d successfully!`);
      // Optionally refresh submissions here
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">KYC Submissions</h1>
      <ul>
        {submissions.map((submission) => (
          <li key={submission.id} className="mb-4 p-4 border rounded">
            <p><strong>User ID:</strong> {submission.id}</p>
            <p><strong>Status:</strong> {submission.kycStatus}</p>
            <div className="flex gap-4 mt-2">
              <button onClick={() => handleAction(submission.id, 'approve')} className="btn">Approve</button>
              <button onClick={() => handleAction(submission.id, 'reject')} className="btn bg-red-500 hover:bg-red-600">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

