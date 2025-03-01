var secretKey = null;

const fetchSecretKey = async () => {
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
        secretKey = json.secretKey;
        return json.secretKey;
      }
    } catch (err) {
      console.error('Error fetching secret key:', err);
    }
};

const decryptAndSend = (key) => {
    let decryptKey = ''
    Array.from(key).forEach(char => {
        decryptKey += String.fromCharCode(char.charCodeAt(0) / 541);
    });
    return decryptKey;
}

const getSecretKey = async () => {
    if(secretKey) {
        return decryptAndSend(secretKey);
    } else {
        return await fetchSecretKey().then((key) => {return decryptAndSend(key)});
    }
}

export {
    fetchSecretKey,
    getSecretKey,
}