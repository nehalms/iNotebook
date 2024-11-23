export const getEncryptKey = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getpubKey`);
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('publicKey', data.key);
      }
    } catch (error) {
      console.error('Error fetching key:', error);
    }
};