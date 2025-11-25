const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const decrypt = require('../middleware/decrypt');
const bcrpyt = require('bcryptjs');
const SecurityPin = require('../models/SecurityPin');
const { updateOTP, getOTP } = require('../store/dataStore');
const { Email } = require('../Services/Email');
const UserModel = require('../models/User');
const { getSecurityPinEnablehtml, getSecurityPinDisablehtml } = require('../Services/getEmailHtml');
const router = express.Router();

// Set security pin (after OTP verification)
router.post('/set', fetchuser, decrypt, async (req, res) => {
    try {
        const { pin } = req.body;
        if (!pin || pin.length !== 6) {
            return res.status(400).json({ status: 0, error: 'Pin must be 6 digits' });
        }
        
        const salt = await bcrpyt.genSalt(10);
        const hashedPin = await bcrpyt.hash(pin, salt);
        
        await SecurityPin.findOneAndUpdate(
            { user: req.user.id },
            { pin: hashedPin, isPinVerified: false, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        
        res.json({ status: 1, msg: 'Security pin enabled successfully' });
    } catch (error) {
        console.error('Error setting pin:', error.message);
        return res.status(500).json({ status: 0, error: 'Internal server error' });
    }
});

// Verify security pin (for login)
router.post('/verify', fetchuser, decrypt, async (req, res) => {
    try {
        const { pin } = req.body;
        if (!pin) {
            return res.status(400).json({ status: 0, error: 'Pin is required' });
        }
        
        const securityPin = await SecurityPin.findOne({ user: req.user.id });
        if (!securityPin) {
            return res.status(404).json({ status: 0, error: 'Security pin not found' });
        }
        
        if (!bcrpyt.compareSync(pin.toString(), securityPin.pin)) {
            return res.status(200).json({ status: 0, msg: 'Invalid pin' });
        }
        
        // Update pin verification status in database
        securityPin.isPinVerified = true;
        await securityPin.save();
        
        res.json({ status: 1, msg: 'Pin verified successfully' });
    } catch (error) {
        console.error('Error verifying pin:', error.message);
        return res.status(500).json({ status: 0, error: 'Internal server error' });
    }
});

// Disable security pin (after OTP verification)
router.post('/disable', fetchuser, async (req, res) => {
    try {
        await SecurityPin.findOneAndDelete({ user: req.user.id });
        res.json({ status: 1, msg: 'Security pin disabled successfully' });
    } catch (error) {
        console.error('Error disabling pin:', error.message);
        return res.status(500).json({ status: 0, error: 'Internal server error' });
    }
});

// Send OTP for enabling security pin
router.post('/enable/otp', fetchuser, async (req, res) => {
    try {
        const existingPin = await SecurityPin.findOne({ user: req.user.id }).select('_id').lean();
        if (existingPin) {
            return res.status(400).json({ status: 0, error: 'Security pin is already enabled' });
        }

        const val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const html = getSecurityPinEnablehtml(val);
        const salt = await bcrpyt.genSalt(10);
        const hashedVal = await bcrpyt.hash(val.toString(), salt);
        const user = await UserModel.findOne({ _id: req.user.id }).select('email').lean();
        if (!user) {
            return res.status(400).json({ status: 0, error: 'User not found' });
        }
        await updateOTP(user.email, {
            code: hashedVal,
            expiryTime: (Date.now() + 10 * 60 * 1000),
        });
        Email(
            user.email,
            [],
            'Enable Security Pin',
            '',
            html,
            false,
        ).catch((emailError) => {
            console.log("Error sending OTP email (non-blocking):", emailError);
        });
        
        res.json({ status: 1, msg: 'OTP has been sent to your email' });
    } catch (error) {
        console.error('Error sending enable OTP:', error.message);
        return res.status(500).json({ status: 0, error: 'Internal server error' });
    }
});

// Send OTP for disabling security pin
router.post('/disable/otp', fetchuser, async (req, res) => {
    try {
        // Check if pin exists
        const existingPin = await SecurityPin.findOne({ user: req.user.id }).select('_id').lean();
        if (!existingPin) {
            return res.status(400).json({ status: 0, error: 'Security pin is not enabled' });
        }

        const val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const html = getSecurityPinDisablehtml(val);
        
        const salt = await bcrpyt.genSalt(10);
        const hashedVal = await bcrpyt.hash(val.toString(), salt);
        const user = await UserModel.findOne({ _id: req.user.id }).select('email').lean();
        if (!user) {
            return res.status(400).json({ status: 0, error: 'User not found' });
        }
        
        await updateOTP(user.email, {
            code: hashedVal,
            expiryTime: (Date.now() + 10 * 60 * 1000),
        });
        
        Email(
            user.email,
            [],
            'Disable Security Pin',
            '',
            html,
            false,
        ).catch((emailError) => {
            console.log("Error sending OTP email (non-blocking):", emailError);
        });
        
        res.json({ status: 1, msg: 'OTP has been sent to your email' });
    } catch (error) {
        console.error('Error sending disable OTP:', error.message);
        return res.status(500).json({ status: 0, error: 'Internal server error' });
    }
});

// Verify OTP for enable/disable
router.post('/verify-otp', fetchuser, decrypt, async (req, res) => {
    try {
        const { code, action } = req.body; // action: 'enable' or 'disable'
        if (!code || !action) {
            return res.status(400).json({ status: 0, error: 'Code and action are required' });
        }

        // Fetch user email from database
        const user = await UserModel.findOne({ _id: req.user.id }).select('email').lean();
        if (!user) {
            return res.status(400).json({ status: 0, error: 'User not found' });
        }

        const otpManager = await getOTP(user.email);
        if (!otpManager || !bcrpyt.compareSync(code.toString(), otpManager.code)) {
            return res.status(200).json({ status: 0, verified: false, msg: 'Invalid code' });
        }

        if (Date.now() > otpManager.expiryTime) {
            return res.status(200).json({ status: 0, verified: false, msg: 'OTP expired' });
        }

        // Verify action is valid
        if (action === 'enable') {
            const existingPin = await SecurityPin.findOne({ user: req.user.id }).select('_id').lean();
            if (existingPin) {
                return res.status(400).json({ status: 0, error: 'Security pin is already enabled' });
            }
        } else if (action === 'disable') {
            const existingPin = await SecurityPin.findOne({ user: req.user.id }).select('_id').lean();
            if (!existingPin) {
                return res.status(400).json({ status: 0, error: 'Security pin is not enabled' });
            }
        } else {
            return res.status(400).json({ status: 0, error: 'Invalid action' });
        }

        res.json({ status: 1, verified: true, msg: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        return res.status(500).json({ status: 0, error: 'Internal server error' });
    }
});

module.exports = router;
