import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const encryptionKey = process.env.ENCRYPTION_KEY;

export const encrypt = (text) => {
  if (!text) return null;
  return CryptoJS.AES.encrypt(text, encryptionKey).toString();
};

export const decrypt = (ciphertext) => {
  if (!ciphertext) return null;
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};