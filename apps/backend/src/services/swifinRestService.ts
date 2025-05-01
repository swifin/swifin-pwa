// apps/backend/src/services/swifinRestService.ts
import axios from 'axios';

export const authenticateSwifinUser = async (swifinId: string, password: string) => {
  const baseUrl = process.env.SWIFIN_BASE_URL;

  if (!baseUrl) {
    console.error('❌ SWIFIN_BASE_URL is not defined in environment variables.');
    return null;
  }

  const credentials = Buffer.from(`${swifinId}:${password}`).toString('base64');

  try {
    const response = await axios.get(`${baseUrl}/member`, {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: 'application/json',
      },
      params: { swifinId },
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });

    if (response.status === 401 || response.status === 403) {
      console.warn(`⚠️ Authentication failed for ${swifinId}: Unauthorized`);
      return null;
    }

    if (!response.data || response.data.error) {
      console.warn(`⚠️ No valid data returned for ${swifinId}:`, response.data?.error || 'Unknown error');
      return null;
    }

    const { name, swifinId: id, email, gender, country, memberType } = response.data;

    if (!id || !name) {
      console.warn(`⚠️ Incomplete profile data received for ${swifinId}`, response.data);
      return null;
    }

    return {
      swifinId: id,
      name,
      email: email || '',
      gender: gender || '',
      country: country || '',
      memberType: memberType || '',
    };
  } catch (error: any) {
    console.error('❌ Error authenticating with Swifin API:', error?.response?.data || error.message);
    return null;
  }
};

