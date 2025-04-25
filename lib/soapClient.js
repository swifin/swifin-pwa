import axios from "axios";
import { Buffer } from "buffer";

export async function SOAPRequest({ endpoint, body, auth }) {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    Authorization: `Basic ${Buffer.from(auth).toString("base64")}`,
  };

  const response = await axios.post(endpoint, body, { headers });
  return response.data;
}
