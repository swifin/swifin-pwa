// apps/backend/src/services/swifinRestService.ts
import axios from 'axios';

export const getMemberProfile = async (swifinId: string, password: string) => {
  const baseUrl = process.env.SWIFIN_BASE_URL;
  const credentials = Buffer.from(`${swifinId}:${password}`).toString('base64');

  try {
    const response = await axios.get(`${baseUrl}/member`, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      params: { swifinId },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile: ${error}`);
  }
};
