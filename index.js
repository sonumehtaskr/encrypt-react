import { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

function encrypt(text, secretKey) {
  const key = CryptoJS.enc.Hex.parse(secretKey);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv,
  });
  return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

function decrypt(encryptedText, secretHexKey) {
  const [ivHex, ciphertextHex] = encryptedText.split(':');
  const key = CryptoJS.enc.Hex.parse(secretHexKey);
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const ciphertext = CryptoJS.enc.Hex.parse(ciphertextHex);
  const encrypted = CryptoJS.lib.CipherParams.create({
    ciphertext,
    formatter: CryptoJS.format.Hex,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function useAxiosEncrypt(secretKey) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!secretKey || secretKey.length !== 64) {
      console.error('Secret key must be 64 hex characters');
      return;
    }

    const reqId = axios.interceptors.request.use((config) => {
      if (config.data && typeof config.data === 'object') {
        const json = JSON.stringify(config.data);
        const encrypted = encrypt(json, secretKey);
        config.data = { data: encrypted };
      }
      return config;
    });

    const resId = axios.interceptors.response.use(
      (response) => {
        if (response.data && typeof response.data.data === 'string') {
          try {
            const decrypted = decrypt(response.data.data, secretKey);
            response.data = JSON.parse(decrypted);
          } catch (e) {
            console.error('Failed to decrypt response:', e);
          }
        }
        return response;
      },
      (error) => {
        if (
          error.response &&
          error.response.data &&
          typeof error.response.data.data === 'string'
        ) {
          try {
            const decrypted = decrypt(error.response.data.data, secretKey);
            error.response.data = JSON.parse(decrypted);
          } catch (e) {
            console.error('Failed to decrypt error response:', e);
          }
        }
        return Promise.reject(error);
      }
    );

    setReady(true);

    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, [secretKey]);

  return ready;
}
