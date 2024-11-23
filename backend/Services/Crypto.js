const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

const encryptedMsg = (message) => {
    const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));
    return encryptedMessage.toString('base64');
}

const decryptedMsg = (encryptedBase64Message) => {
    try {
      const encryptedBuffer = Buffer.from(encryptedBase64Message, 'base64');
  
      const decryptedMessage = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        encryptedBuffer
      );
  
      return decryptedMessage.toString('utf8');
    } catch (error) {
      console.error('Decryption failed:', error.message);
      throw error;
    }
  };
  

module.exports = {
    publicKey,
    encryptedMsg,
    decryptedMsg,
}