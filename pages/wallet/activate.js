import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { countries } from '../../utils/countries'; // adjust if needed

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

      const customValues = {};
      profile.customValues?.forEach((item) => {
        customValues[item.internalName] = item;
      });

      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        birthday: customValues['birthday']?.value || '',
        gender: '', // Gender missing in login payload — user will select manually
        mobilePhone: customValues['mobilePhone']?.value || '',
        address: customValues['address']?.value || '',
        postalCode: customValues['postalCode']?.value || '',
        city: customValues['city']?.value || '',
        country: customValues['country']?.possibleValueId?.toString() || '',
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobilePhone') {
      let newValue = value;
      if (newValue.length > 0 && !newValue.startsWith('+')) {
        newValue = '+' + newValue.replace(/^0+/, '');
      }
      setFormData({ ...formData, [name]: newValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateFormData = () => {
    const { name, email, birthday, gender, mobilePhone, address, postalCode, city, country } = formData;

    if (!name || !email || !birthday || !gender || !mobilePhone || !address || !postalCode || !city || !country) {
      toast.error('Please complete all fields.');
      return false;
    }

    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdayRegex.test(birthday)) {
      toast.error('Birthday must be in format YYYY-MM-DD.');
      return false;
    }

    const mobileRegex = /^\+\d{10,15}$/;
    if (!mobileRegex.test(mobilePhone)) {
      toast.error('Mobile Phone must start with + and contain 10-15 digits. Example: +447000000001');
      return false;
    }

    if (gender !== '1' && gender !== '2') {
      toast.error('Gender must be selected.');
      return false;
    }

    return true;
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    const swifinId = localStorage.getItem('swifinId');

    if (!swifinId) {
      toast.error('You must be logged in first!');
      return;
    }

    if (!validateFormData()) return;

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, swifinId }),
      });

      if (response.ok) {
        toast.success('🎉 Wallet Activated Successfully!');
        router.push('/wallet/success');
      } else {
        const errorData = await response.json();
        toast.error('Activation Failed: ' + (errorData.message || 'Unknown Error'));
        console.error('Backend error:', errorData);
      }
    } catch (err) {
      console.error('Activation error:', err);
      toast.error('Unexpected error during activation.');
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
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
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
            placeholder="Mobile Phone (e.g., +447000000001)"
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

