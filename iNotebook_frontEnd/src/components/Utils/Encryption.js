import forge from 'node-forge';

export const encryptMessage = (message) => {
    const key = sessionStorage.getItem('publicKey');
    try {
      const publicKey = forge.pki.publicKeyFromPem(key);

      const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
      });

      return forge.util.encode64(encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
};