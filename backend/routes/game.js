const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const GameDetails = require('../models/GameDetails');
const User = require('../models/User');

router.post('/tictactoe', fetchuser, async (req, res) => {
    try { 
        let userName = await User.findById(req.user.id);
        let userStats = await GameDetails.findOne({userId: req.user.id});
        if(!userStats) {
            userStats = await GameDetails.create({
                userId: req.user.id,
                userName: userName.name,
                tttStats: {
                    played: 0,
                    won: 0,
                    lost: 0,
                }
            });
        }
        res.send(userStats);
    } catch (err) {
        console.log("Error**", err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/tttsave', fetchuser, async (req, res) => {
    try {
        let userStats = await GameDetails.findOne({userId: req.user.id});
        if(req.query.won == undefined || !userStats) {
            res.send("send the query parameter");
            return;
        }
        let [won, lost] = req.query.won == 'true' ? [1, 0] : [0, 1];
        userStats.tttStats.set('played', userStats.tttStats.get('played') + 1);
        userStats.tttStats.set('won', userStats.tttStats.get('won') + won);
        userStats.tttStats.set('lost', userStats.tttStats.get('lost') + lost);

        let updatedStats = await userStats.save();
        res.send(updatedStats);
        
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router
