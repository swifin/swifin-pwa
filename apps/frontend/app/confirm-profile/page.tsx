'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ConfirmProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pendingProfile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swifinId: profile.swifinId, profile: { ...profile, isProfileConfirmed: true } }),
      });

      const updated = await response.json();
      localStorage.setItem('userProfile', JSON.stringify(updated));
      localStorage.removeItem('pendingProfile');
      router.push('/dashboard');
    } catch (err) {
      alert('Failed to confirm profile. Please try again.');
    }
    setLoading(false);
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Confirm Your Profile</h2>
      <ul className="mb-4">
        <li><strong>Name:</strong> {profile.name}</li>
        <li><strong>Email:</strong> {profile.email}</li>
        <li><strong>Country:</strong> {profile.country}</li>
        <li><strong>Gender:</strong> {profile.gender}</li>
        <li><strong>Member Type:</strong> {profile.memberType}</li>
      </ul>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Submitting...' : 'Confirm Profile'}
      </button>
    </div>
  );
};

export default ConfirmProfilePage;
