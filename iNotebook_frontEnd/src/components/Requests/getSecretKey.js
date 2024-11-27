export const getSecretKey = async () => {
    try {
      if (sessionStorage.getItem('AesKey') || !localStorage.getItem('token')) return;
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/aes/secretKey`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const json = await response.json();
      if (json.status === 'success') sessionStorage.setItem('AesKey', json.secretKey);
      return 
    } catch (err) {
      console.error('Error fetching secret key:', err);
    }
};