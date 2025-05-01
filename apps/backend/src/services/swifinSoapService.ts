// apps/backend/src/services/swifinSoapService.ts
import axios from 'axios';
import { createSoapEnvelope } from '../utils/soapClient';

const adminId = process.env.SWIFIN_ADMIN_ID;
const adminPass = process.env.SWIFIN_ADMIN_PASSWORD;
const baseUrl = process.env.SWIFIN_BASE_URL;

const adminAuth = Buffer.from(`${adminId}:${adminPass}`).toString('base64');

export const registerMember = async (memberData: Record<string, string>) => {
  const xml = createSoapEnvelope('registerMember', memberData);

  try {
    const { data } = await axios.post(`${baseUrl}/MemberWebService`, xml, {
      headers: {
        'Content-Type': 'text/xml',
        Authorization: `Basic ${adminAuth}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`Registration failed: ${error}`);
  }
};

export const updateMember = async (memberData: Record<string, string>) => {
  const xml = createSoapEnvelope('updateMember', memberData);

  try {
    const { data } = await axios.post(`${baseUrl}/MemberWebService`, xml, {
      headers: {
        'Content-Type': 'text/xml',
        Authorization: `Basic ${adminAuth}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`Profile update failed: ${error}`);
  }
};
