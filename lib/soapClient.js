/* ~/swifin-pwa/lib/soapClient.js */

// /lib/soapClient.js

import axios from "axios";
import { Buffer } from "buffer";

// Make sure this function is exported EXACTLY as SOAPRequest
export async function SOAPRequest({ endpoint, body, auth }) {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    Authorization: `Basic ${Buffer.from(auth).toString("base64")}`,
  };

  try {
    const response = await axios.post(endpoint, body, { headers });
    return response.data;
  } catch (error) {
    console.error('SOAP Request Error:', error.response?.data || error.message);
    throw new Error('SOAP Request Failed');
  }
}

