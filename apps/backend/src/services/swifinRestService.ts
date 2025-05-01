// apps/backend/src/services/swifinRestService.ts
import axios from 'axios';

export const authenticateSwifinUser = async (swifinId: string, password: string) => {
  const baseUrl = process.env.SWIFIN_BASE_URL || 'https://api.swifin.com/rest';
  const credentials = Buffer.from(`${swifinId}:${password}`).toString('base64');

  try {
    const response = await axios.get(`${baseUrl}/members/me`, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      validateStatus: (status) => status >= 200 && status < 500,
    });

    console.log('Swifin API response:', response.status, response.data); // for debugging

    if (response.status === 401 || !response.data || response.data.error) {
      console.warn(`Authentication failed for ${swifinId}:`, response.data?.error || 'Unauthorized');
      return null;
    }

    const { name, email, country, gender, memberType } = response.data;
    return {
      swifinId,
      name,
      email,
      country,
      gender,
      memberType,
    };
  } catch (error: any) {
    console.error('Swifin authentication error:', error?.response?.data || error.message);
    return null;
  }
};

