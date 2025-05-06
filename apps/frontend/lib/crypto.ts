// apps/frontend/lib/crypto.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
// 32‐byte key and 16‐byte IV loaded from env, hex‐encoded
const KEY = Buffer.from(process.env.CRYPTO_KEY!, 'hex');
const IV = Buffer.from(process.env.CRYPTO_IV!, 'hex');

/**
 * Encrypt a password string (AES-256-CBC).
 */
export function encryptPassword(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypt an encrypted password string.
 */
export function decryptPassword(encrypted: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

