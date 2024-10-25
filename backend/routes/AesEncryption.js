const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()

router.get('/secretkey', fetchuser, async (req, res) => {
    try{
        let key = process.env.AES_KEY;
        let encryptKey = ''
        Array.from(key).forEach(char => {
            encryptKey += String.fromCharCode(char.charCodeAt(0) * 541);
        });
        res.status(200).send({status: 'success', secretKey: encryptKey});
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send('Internal server Error');
    }
});

module.exports = router;