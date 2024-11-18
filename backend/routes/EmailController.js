const express = require('express')
const { Email } = require('../Services/Email');
const { getForgotPasshtml, getAdminhtml, getAdminNotifyhtml, getSignUphtml } = require('../Services/getEmailHtml');
const router = express.Router()
const otpManager = {};

router.post('/send', async (req, res) => {
    try {
        var val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        let html;
        if(req.body.subject == 'Reset Password') {
            html = getForgotPasshtml(val);
        } else if(req.body.subject == 'Admin Login') {
            html = getAdminhtml(val);
        } else if(req.body.subject == 'Create Account') {
            html = getSignUphtml(val);
        }
        otpManager[req.query.toAdmin == 'true' ? process.env.ADMIN_EMAIL : req.body.email] = {
            code: val,
            expiryTime: (Date.now() + 10 * 60 * 1000),
        };
        Email(
            req.body.email,
            req.body.cc,
            req.body.subject,
            req.body.text,
            html,
            req.query.toAdmin,
        )
        .then((data) => {
            res.send({success: true, data: data});
        })
        .catch((err) => {
            res.status(500).send(err);
        })
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

router.post('/verify', async(req, res) => {
    try {
        let email = req.header('email');
        let code = req.header('code');
        if(otpManager[email] && otpManager[email].code == code) {
            if(Date.now() > otpManager[email].expiryTime) {
                res.send({success: true, verified: false, msg: 'Otp expired'});
                return;
            }
            res.send({success: true, verified: true, msg: 'Otp verified'});
        } else {
            res.send({success: true, verified: false, msg: 'Invalid code'});
        }
        return;
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router