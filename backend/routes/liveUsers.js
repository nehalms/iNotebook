const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const User = require("../models/User");
const { updateLiveUser, getLiveUsers } = require('../store/dataStore');

router.get('/:deviceId', fetchuser, async (req, res) => {
    try {
        let deviceId = req.params.deviceId;
        if(!deviceId) {
            res.status(200).json({ message: "Device ID is required" });
            return;
        }
        let userId = req.user.id;
        if(userId == '66b33ae6a01d63e673a568c5') {
            res.status(200).json({ status: 0, message: "User is not allowed to send heartbeat" });
            return;
        }
        let user = await User.findById(userId);
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
        liveUser = {
            name: user.name || 'User',
            ip: ip,
        };
        await updateLiveUser(userId, deviceId, liveUser);
        res.status(200).json({ message: "Heartbeat received" });
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/live/users', fetchuser, async (req, res) => {
    let adminUser = await User.findById(req.user.id);
    if(!adminUser || !adminUser.isAdmin) {
        res.status(404).send({ status: 'Error', message: 'Not Authorized'});
        return;
    }
    try {
        let liveUsers = await getLiveUsers();
        let activeLiveUsersObj = [];
        
        Object.keys(liveUsers).forEach((key) => {
            const parts = key.split("::");
            let obj = {
                id: parts[0],
                deviceId: parts[1] || '',
                name: liveUsers[key].name,
                ip: liveUsers[key].ip,
            };
            activeLiveUsersObj.push(obj);
        });
        res.send({status: 1, liveUsers: activeLiveUsersObj});
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router