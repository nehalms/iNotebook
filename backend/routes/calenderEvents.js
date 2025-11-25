const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const checkPinVerification = require('../middleware/checkPinVerification')
const router = express.Router()
const Events = require('../models/Events')
const UserHistory = require('../models/UserHistory');
const scope = 'calendar';

router.get('/', fetchuser, checkPermission(scope), checkPinVerification, async (req, res) => {
    try {
        const events = await Events.find({user: req.user.id}).lean();
        res.send({
            status: 1,
            data: events,
        })
    } catch (err) {
        console.log("Error(news/top)***", err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/add', fetchuser, checkPermission(scope), checkPinVerification, async (req, res) => {
    try {
        let body = req.body;
        if(!body) {
            return res.status(404).send({error: "Please send the request body"});
        }
        // Parallelize event creation and history
        const [event] = await Promise.all([
            Events.create({
                user: req.user.id,
                title: body.title,
                start: body.start,
                end: body.end,
                desc: body.desc,
            }),
            UserHistory.create({
                userId: req.user.id,
                action: "Event added",
            })
        ]);
        res.send({
            status: 1,
            msg: 'New Event added',
            event
        })
    } catch (err) {
        console.log("Error(news/top)***", err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', fetchuser, checkPermission(scope), checkPinVerification, async (req, res) => {
    try {
        let id = req.params.id;
        if(!id) {
            res.status(404).send({error: "Please send the event id"});
        }
        let event = await Events.findByIdAndDelete(id);
        if(event) {
            res.send({
                status: 1,
                msg: "Event deleted",
                event
            })
        } else {
            res.status(404).send({error: "No Event found for the give id"});
        }
    } catch (err) {
        console.log("Error(news/top)***", err.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router