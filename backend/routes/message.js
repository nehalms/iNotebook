const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const StegCloak = require('stegcloak');
const scope = 'messages';

router.post('/encrypt', fetchuser, checkPermission(scope),  async (req, res) => {
    try {
        const stegcloak = new StegCloak(true);
        const secretMessage = req.body.secretMsg;
        const coverText = req.body.coverMsg;
        const password = req.body.password;
        try {
            const concealedText = stegcloak.hide(secretMessage, password, coverText);
            res.send({success: true, msg: concealedText});
        } catch (err) {
            console.log(err);
            res.send({success: false, msg: err.message});
        }
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.post('/decrypt', fetchuser, checkPermission(scope),  async (req, res) => {
    try {
        const stegcloak = new StegCloak(true);
        const concealedText = req.body.msg;
        const password = req.body.password;
        try {
            const revealedMessage = stegcloak.reveal(concealedText, password);
            res.send({success: true, msg: revealedMessage});
        } catch (err) {
            res.send({success: false, msg: err.message})
        }
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

module.exports = router;