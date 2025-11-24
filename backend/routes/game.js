const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const GameDetails = require('../models/GameDetails');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const JWT_SCERET = process.env.JWT_SCERET;
const scope = 'games';

router.get("/authenticateUser/:token/:apikey", async (req, res) => {
    const token = req.params.token;
    const apiKey = req.params.apikey;
    if(!token || !apiKey){
        return res.send(false);
    }
    try {
        const apiData = jwt.verify(apiKey, JWT_SCERET);
        // Use lean() and select only needed field
        const adminUser = await User.findById(apiData.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            return res.status(404).send({ status: 'Error', message: 'Not Authorized'});
        }
        const tokenData = jwt.verify(token, JWT_SCERET);
        if(tokenData && tokenData.user) {
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
        // Parallelize user and stats fetch
        const [userName, userStats] = await Promise.all([
            User.findById(req.user.id).select('name').lean(),
            GameDetails.findOne({userId: req.user.id}).lean()
        ]);
        
        if(!userStats) {
            const newStats = await GameDetails.create({
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
            return res.send({stats: newStats, authToken: req.cookies.authToken});
        }
        res.send({stats: userStats, authToken: req.cookies.authToken});
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
        // Use lean() and select only needed field
        const adminUser = await User.findById(data.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        let p1Id = req.params.player1;
        let p2Id = req.params.player2;
        // Parallelize stats fetch
        const [userStats1, userStats2] = await Promise.all([
            GameDetails.findOne({userId: p1Id}),
            GameDetails.findOne({userId: p2Id})
        ]);
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

        // Parallelize saves
        const [player1, player2] = await Promise.all([
            userStats1.save(),
            userStats2.save()
        ]);
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
        // Use lean() and select only needed field
        const adminUser = await User.findById(data.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        let p1Id = req.params.player1;
        let p2Id = req.params.player2;
        // Parallelize stats fetch
        const [userStats1, userStats2] = await Promise.all([
            GameDetails.findOne({userId: p1Id}),
            GameDetails.findOne({userId: p2Id})
        ]);
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

        // Parallelize saves
        const [player1, player2] = await Promise.all([
            userStats1.save(),
            userStats2.save()
        ]);
        res.send({success: true, message: 'Stats updated for both users', data: {player1: player1, player2: player2}});
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router
