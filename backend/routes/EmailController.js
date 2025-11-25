const express = require('express')
const { Email } = require('../Services/Email');
const { getForgotPasshtml, getAdminhtml, getSignUphtml, getSecurityPinEnablehtml, getSecurityPinDisablehtml } = require('../Services/getEmailHtml');
const { updateOTP, getOTP } = require('../store/dataStore');
const bcrpyt = require("bcryptjs");
const decrypt = require('../middleware/decrypt');
const router = express.Router()

router.post('/send', async (req, res) => {
    try {
        var val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        let html;
        const subject = req.body.subject || '';
        
        if(subject == 'Reset Password' || subject == 'Reset security pin') {
            html = getForgotPasshtml(val);
        } else if(subject == 'Admin Login') {
            html = getAdminhtml(val);
        } else if(subject == 'Create Account') {
            html = getSignUphtml(val);
        } else if(subject == 'Enable Security Pin') {
            html = getSecurityPinEnablehtml(val);
        } else if(subject == 'Disable Security Pin') {
            html = getSecurityPinDisablehtml(val);
        }
        const salt = await bcrpyt.genSalt(10); 
        const hashedVal = await bcrpyt.hash(val.toString(), salt);
        await updateOTP(req.query.toAdmin == 'true' ? process.env.ADMIN_EMAIL : req.body.email, {
            code: hashedVal,
            expiryTime: (Date.now() + 10 * 60 * 1000),
        });
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

router.post('/verify', decrypt, async(req, res) => {
    try {
        let email = req.body['email'];
        let code = req.body['code'];
        let otpManager = await getOTP(email);
        if(otpManager && bcrpyt.compareSync(code.toString(), otpManager.code)) {
            if(Date.now() > otpManager.expiryTime) {
                res.send({status: 0, success: true, verified: false, msg: 'OTP expired'});
                return;
            }
            res.send({success: true, verified: true, msg: 'OTP verified'});
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