const crypto = require('crypto');
const Keys = require('../models/Keys');

// Cache the private key to avoid repeated database queries
let cachedPrivateKey = null;
let keyCacheTime = null;
const KEY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

const getKey = async () => {
    try {
        // Return cached key if still valid
        if (cachedPrivateKey && keyCacheTime && (Date.now() - keyCacheTime) < KEY_CACHE_TTL) {
            return { privateKey: cachedPrivateKey };
        }
        
        // Fetch and cache the key
        let key = await Keys.findOne().select('privateKey').lean();
        if (key && key.privateKey) {
            cachedPrivateKey = key.privateKey;
            keyCacheTime = Date.now();
        }
        return key;
    } catch (error) {
        console.error('Decryption failed:', error.message);
        throw error;
    }
};

const decryptedMsg = async (encryptedBase64Message) => {
    try {
        let privateKey;
        await getKey().then((key) => {
                privateKey = key.privateKey;
            });
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


const decrypt = async (req, res, next) => {
    try{
        if( req.body && Object.keys(req.body).length ) {
            let body = req.body;
            const keys = Object.keys(body);
            await Promise.all(
                keys.map(async (key) => {
                    req.body[key] = await decryptedMsg(body[key]);
                })
            );
        }
        next();
    } catch(err){
        console.log("Error***", err);
        res.status(500).send("Internal server error");
    }
};

module.exports = decrypt;