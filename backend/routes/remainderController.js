const express = require('express')
const fetchuser = require('../middleware/fetchuser');
const decrypt = require('../middleware/decrypt');
const { getReaminders, setRemainder, deleteRemainder } = require('../Services/remainderService');
const router = express.Router()

router.get('/', fetchuser, async(req, res) => {
    try {
        await getReaminders(req)
            .then( async (data) => {
                res.send({status: 1, data: data})
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

router.post('/', fetchuser, decrypt, async (req, res) => {
    try {
        await setRemainder(req)
            .then( async (data) => {
                res.send(data)
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

router.delete('/:id', fetchuser, async (req, res) => {
    try {
        await deleteRemainder(req)
            .then( async (data) => {
                res.send(data)
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

module.exports = router;