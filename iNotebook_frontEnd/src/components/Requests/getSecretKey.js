import { useState, useEffect } from 'react';

const fetchSecretKeyFromServer = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/aes/secretKey`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const json = await response.json();
    if (json.status === 'success') {
      return json.secretKey;
    }
    throw new Error('Failed to fetch secret key');
  } catch (err) {
    console.error('Error fetching secret key:', err);
    return null;
  }
};

const decryptAndSend = (key) => {
  if (!key) return null;
  let decryptKey = '';
  Array.from(key).forEach((char) => {
    decryptKey += String.fromCharCode(char.charCodeAt(0) / 541);
  });
  return decryptKey;
};

const useSecretKey = () => {
  const [secretKey, setSecretKey] = useState(null);

  useEffect(() => {
    if (!secretKey) {
      fetchSecretKeyFromServer().then((key) => {
        if (key) setSecretKey(key);
      });
    }
  }, [secretKey]);

  const getSecretKey = async () => {
    if (secretKey) {
      return decryptAndSend(secretKey);
    } else {
      const fetchedKey = await fetchSecretKeyFromServer();
      if (fetchedKey) {
        setSecretKey(fetchedKey);
        return decryptAndSend(fetchedKey);
      }
      return null;
    }
  };

  return { secretKey, getSecretKey };
};

export { useSecretKey };