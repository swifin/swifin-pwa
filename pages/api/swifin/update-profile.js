// /pages/api/swifin/update-profile.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    swifinId,
    password,
    birthday,
    gender,
    address,
    postalCode,
    city,
    country,
    mobilePhone
  } = req.body;

  if (!swifinId || !password) {
    return res.status(400).json({ message: 'Swifin ID and password are required' });
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SWIFIN_API_URL}/profile/custom-values`;

    const fields = [];

    if (birthday) fields.push({ internalName: 'birthday', value: birthday });
    if (gender) fields.push({ internalName: 'gender', value: gender });
    if (address) fields.push({ internalName: 'address', value: address });
    if (postalCode) fields.push({ internalName: 'postalCode', value: postalCode });
    if (city) fields.push({ internalName: 'city', value: city });
    if (country) fields.push({ internalName: 'country', value: country });
    if (mobilePhone) fields.push({ internalName: 'mobilePhone', value: mobilePhone });

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${swifinId}:${password}`).toString('base64'),
      },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message || 'Failed to update profile' });
    }

    const data = await response.json();

    return res.status(200).json({ message: 'Profile updated successfully', data });
  } catch (error) {
    console.error('Update Profile API error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

