const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const Events = require('../models/Events')
const UserHistory = require('../models/UserHistory');
const scope = 'calender';

router.get('/', fetchuser, checkPermission(scope), async (req, res) => {
    try {
        let events = await Events.find({user: req.user.id});
        res.send({
            status: 1,
            data: events,
        })
    } catch (err) {
        console.log("Error(news/top)***", err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/add', fetchuser, checkPermission(scope), async (req, res) => {
    try {
        let body = req.body;
        if(!body) {
            res.status(404).send({error: "Please send the request body"});
        }
        let event = await Events.create({
            user: req.user.id,
            title: body.title,
            start: body.start,
            end: body.end,
            desc: body.desc,
        });
        await UserHistory.create({
            userId: req.user.id,
            action: "Event added",
        });
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

router.delete('/:id', fetchuser, checkPermission(scope), async (req, res) => {
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