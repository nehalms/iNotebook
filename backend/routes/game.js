const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const GameDetails = require('../models/GameDetails');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const JWT_SCERET = process.env.JWT_SCERET;
const scope = 'games';

router.get("/authenticateUser/:token", async (req, res) => {
    const token = req.params.token;
    if(!token){
        res.send(false);
    }
    try{
        const data = jwt.verify(token, JWT_SCERET);
        if(data && data.user) {
            res.send(true);
        } else {
            res.send(false);
        }
    }
    catch(err){
        console.log("Error****", err.message);
        res.send(false);
    }
});

router.post('/getStats', fetchuser, checkPermission(scope),  async (req, res) => {
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
                },
                frnRowStats: {
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

router.get('/tttsave/:player1/:p1Stat/:player2/:p2Stat/:apikey', async (req, res) => {
    try {
        if( !req.body ) {
            res.status(400).send({status: 'Not found', message: 'No request body found'});
        }
        const data = jwt.verify(req.params.apikey, JWT_SCERET);
        let adminUser = await User.findById(data.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        let p1Id = req.params.player1;
        let p2Id = req.params.player2;
        let userStats1 = await GameDetails.findOne({userId: p1Id});
        let userStats2 = await GameDetails.findOne({userId: p2Id});
        if(!userStats1 || ! userStats2) {
            res.send({success: false, msg: "No User stats found"});
            return;
        }
        let [won_1, lost_1] = req.params.p1Stat == 1 
            ? [1, 0] : req.params.p2Stat == 1 
                ? [0, 1] : [0, 0];
        userStats1.tttStats.set('played', userStats1.tttStats.get('played') + 1);
        userStats1.tttStats.set('won', userStats1.tttStats.get('won') + won_1);
        userStats1.tttStats.set('lost', userStats1.tttStats.get('lost') + lost_1);

        let [won_2, lost_2] = req.params.p2Stat == 1 
            ? [1, 0] : req.params.p1Stat == 1
                ? [0, 1] : [0, 0];
        userStats2.tttStats.set('played', userStats2.tttStats.get('played') + 1);
        userStats2.tttStats.set('won', userStats2.tttStats.get('won') + won_2);
        userStats2.tttStats.set('lost', userStats2.tttStats.get('lost') + lost_2);

        let player1 = await userStats1.save();
        let player2 = await userStats2.save();
        res.send({success: true, message: 'Stats updated for both users', data: {player1: player1, player2: player2}});
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/frnrsave/:player1/:p1Stat/:player2/:p2Stat/:apikey', async (req, res) => {
    try {
        if( !req.body ) {
            res.status(400).send({status: 'Not found', message: 'No request body found'});
        }
        const data = jwt.verify(req.params.apikey, JWT_SCERET);
        let adminUser = await User.findById(data.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        let p1Id = req.params.player1;
        let p2Id = req.params.player2;
        let userStats1 = await GameDetails.findOne({userId: p1Id});
        let userStats2 = await GameDetails.findOne({userId: p2Id});
        if(!userStats1 || ! userStats2) {
            res.send({success: false, msg: "No User stats found"});
            return;
        }
        let [won_1, lost_1] = req.params.p1Stat == 1 
            ? [1, 0] : req.params.p2Stat == 1 
                ? [0, 1] : [0, 0];
        userStats1.frnRowStats.set('played', userStats1.frnRowStats.get('played') + 1);
        userStats1.frnRowStats.set('won', userStats1.frnRowStats.get('won') + won_1);
        userStats1.frnRowStats.set('lost', userStats1.frnRowStats.get('lost') + lost_1);

        let [won_2, lost_2] = req.params.p2Stat == 1 
            ? [1, 0] : req.params.p1Stat == 1
                ? [0, 1] : [0, 0];
        userStats2.frnRowStats.set('played', userStats2.frnRowStats.get('played') + 1);
        userStats2.frnRowStats.set('won', userStats2.frnRowStats.get('won') + won_2);
        userStats2.frnRowStats.set('lost', userStats2.frnRowStats.get('lost') + lost_2);

        let player1 = await userStats1.save();
        let player2 = await userStats2.save();
        res.send({success: true, message: 'Stats updated for both users', data: {player1: player1, player2: player2}});
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router
