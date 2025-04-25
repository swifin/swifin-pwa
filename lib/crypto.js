// ~/swifin-pwa/lib/crypto.js
import CryptoJS from 'crypto-js';

const secret = process.env.SWIFIN_SECRET_KEY;

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, secret).toString();
}

export function decrypt(cipher) {
  const bytes = CryptoJS.AES.decrypt(cipher, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}
