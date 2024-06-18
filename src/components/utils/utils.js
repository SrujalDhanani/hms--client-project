import React from 'react';
import CryptoJS from 'crypto-js';
import { getApiSecretKey } from '../../env';

const secretKey = getApiSecretKey();


export const encryption = (str) => {
  return CryptoJS.AES.encrypt(str, secretKey).toString();
}

// export const decryption = (str) => {
//   return CryptoJS.AES.decrypt(str, secretKey).toString();
// }

export const decryption = (str) => {
  try {
    const bytes = CryptoJS.AES.decrypt(str, secretKey);
    if (!bytes) {
      // Handle decryption failure gracefully
      return '';
    }
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error("Error during decryption:", error);
    // Handle decryption error gracefully, e.g., by returning an empty string
    return '';
  }
}


