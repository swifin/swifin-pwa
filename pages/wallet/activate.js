import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { countries } from '../../utils/countries'; // adjust path if needed

export default function WalletActivatePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthday: '',
    gender: '',
    mobilePhone: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const swifinId = localStorage.getItem('swifinId');
    if (!swifinId) {
      router.push('/auth/login');
      return;
    }

    const profileStr = localStorage.getItem('profile');
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        birthday: profile.birthday || '',
        gender: profile.gender || '',
        mobilePhone: profile.mobilePhone || '',
        address: profile.address || '',
        postalCode: profile.postalCode || '',
        city: profile.city || '',
        country: '',
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    const swifinId = localStorage.getItem('swifinId');

    if (!swifinId) {
      alert('You must be logged in first!');
      return;
    }

    // ✅ Validate fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.birthday ||
      !formData.gender ||
      !formData.mobilePhone ||
      !formData.address ||
      !formData.postalCode ||
      !formData.city ||
      !formData.country
    ) {
      alert('Please complete all fields before activating.');
      return;
    }

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, swifinId }),
      });

      if (response.ok) {
        alert('Wallet Activated Successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        alert('Activation Failed: ' + (errorData.message || 'Unknown Error'));
        console.error('Backend error:', errorData);
      }
    } catch (err) {
      console.error('Activation error:', err);
      alert('Unexpected error during activation.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold text-blue-600">Loading your wallet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Activate Your Wallet</h1>

        <form onSubmit={handleActivate} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            placeholder="Birthday"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
          <input
            type="text"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            placeholder="Mobile Phone"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-md transition"
          >
            Activate Wallet
          </button>
        </form>
      </div>
    </div>
  );
}

