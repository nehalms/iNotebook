const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const decrypt = require('../middleware/decrypt');
const bcrpyt = require('bcryptjs');
const SecurityPin = require('../models/SecurityPin');
const router = express.Router();

router.post('/set', fetchuser, decrypt, async (req, res) => {
    try {
        const { pin } = req.body;
        if (!pin) {
            return res.status(400).json({ error: 'Pin is required' });
        }
        const salt = await bcrpyt.genSalt(10);
        hashedPin = await bcrpyt.hash(pin, salt);
        const securityPin = await SecurityPin.findOne({user: req.user.id});
        let pinData = null;
        if(!securityPin) {
            pinData = await new SecurityPin({ user: req.user.id, pin: hashedPin, isPinVerified: true}).save();
        } else {
            pinData = await SecurityPin.findOneAndUpdate({user: req.user.id}, { pin: hashedPin, isPinVerified: true }, { new: true });
        }
        res.json({ status: 1, msg: 'Pin set successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/verify', fetchuser, decrypt, async (req, res) => {
    try {
        const { pin } = req.body;
        if (!pin) {
            return res.status(400).json({ error: 'Pin is required' });
        }
        const securityPin = await SecurityPin.findOne({user: req.user.id});
        if (!securityPin) {
            return res.status(404).json({ error: 'Pin not found' });
        }
        if(!bcrpyt.compareSync(pin.toString(), securityPin.pin)) {
            return res.status(200).json({status: 0, msg: 'Invalid pin' });
        }
        await SecurityPin.findOneAndUpdate({user: req.user.id}, { isPinVerified: true });
        res.json({ status: 1, msg: 'Pin verified' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;