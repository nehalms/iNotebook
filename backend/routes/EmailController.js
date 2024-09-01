const express = require('express')
const fetchuser = require('../middleware/fetchuser');
const { Email } = require('../Services/Email');
const router = express.Router()

router.post('/send', async (req, res) => {
    try {
        Email(
            req.body.email,
            req.body.cc,
            req.body.subject,
            req.body.text,
            req.body.html,
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

module.exports = router