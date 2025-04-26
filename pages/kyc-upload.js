// pages/kyc-upload.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function KYCUpload() {
  const router = useRouter();
  const [selfie, setSelfie] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSelfieChange = (e) => {
    setSelfie(e.target.files[0]);
  };

  const handleIdDocChange = (e) => {
    setIdDoc(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selfie || !idDoc) {
      setError('Please upload both a selfie and an ID document.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('selfie', selfie);
    formData.append('idDoc', idDoc);

    try {
      const res = await fetch('/api/swifin/upload-kyc', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccess('KYC documents uploaded successfully! Pending approval.');
        router.push('/dashboard');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600">Upload KYC Documents</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload a Selfie</label>
            <input type="file" accept="image/*" onChange={handleSelfieChange} required className="input" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload ID Document</label>
            <input type="file" accept="image/*,application/pdf" onChange={handleIdDocChange} required className="input" />
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            {uploading ? 'Uploading...' : 'Submit KYC'}
          </button>
        </form>
      </div>
    </div>
  );
}
