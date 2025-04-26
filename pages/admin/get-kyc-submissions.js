// pages/admin/get-kyc-submissions.js
import { useEffect, useState } from 'react';

export default function GetKycSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch('/api/admin/get-kyc-submissions');
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">KYC Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((submission) => (
            <li key={submission.id} className="p-4 border rounded">
              <p><strong>ID:</strong> {submission.id}</p>
              <p><strong>Status:</strong> {submission.kycStatus}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
