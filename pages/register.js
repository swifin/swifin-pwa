// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthday: '',
    gender: '',
    mobilePhone: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/swifin/register-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`🎉 Registration successful!\nYour Swifin ID is: ${data.username}`);
        router.push('/activate-wallet');
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">Create Your Swifin Wallet</h1>
        <p className="text-center text-gray-600">Join the movement for inclusive prosperity.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="input" required />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="input" required />
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="input" required />
            <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} className="input" required />
            <select name="gender" value={formData.gender} onChange={handleChange} className="input" required>
              <option value="">Select Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
            <input name="mobilePhone" value={formData.mobilePhone} onChange={handleChange} placeholder="Mobile Phone" className="input" required />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input" required />
            <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="input" required />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="input" required />
            <input name="country" value={formData.country} onChange={handleChange} placeholder="Country ID (e.g., 10)" className="input" required />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition"
          >
            {loading ? 'Registering...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

