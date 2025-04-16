const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const User = require("../models/User");
const Notes = require('../models/Notes')
const LoginHistory = require('../models/LoginHistory')
const GameDetails = require('../models/GameDetails')
const Task = require('../models/Task')
const moment = require('moment');
const UserHistory = require('../models/UserHistory');

router.get('/users', fetchuser, async (req, res)=> {
    try{
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        const Users = await User.find({email: {$ne: 'inotebook002@gmail.com'}});
        const notes = await Notes.find();
        const tasks = await Task.find();
        const loginHistories = await LoginHistory.find();
        const userHistories = await UserHistory.find();
        Users.sort((user1, user2) => {return user1.name.toLowerCase() > user2.name.toLowerCase() ? 1 : -1})
        let response = {};
        let data = [];
        await Promise.all(
            Users.map(async (user, i) => {
                let User = {
                    id: i + 1,
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    date: user.date,
                    lastLoggedOn: user.lastLogIn,
                    isActive: user.isActive,
                }
                const countOfUserNotes = await Notes.find({user: user.id});
                User.notesCount = countOfUserNotes.length;
                const countOfUserTasks = await Task.find({user: user.id});
                User.tasksCount = countOfUserTasks.length;
                data.push(User);  
            })
        );
        response.users = data;
        response.usersCount = Users.length;
        response.notesCount = notes.length;
        response.tasksCount = tasks.length;
        response.loginHistoryCount = loginHistories.length;
        response.userHistoryCount = userHistories.length;
        res.json(response);
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.get('/deluser/:userId', fetchuser, async (req, res) => {
    try {
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        if(!req.params.userId) {
            res.send({success: false, msg: 'Please send the user Id'});
        }
        let user = await User.findOneAndDelete({_id: req.params.userId});
        if(!user) {
            res.send({success: false, msg: 'No user found with the given Id'});
        }
        res.send(user);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

router.get('/graphData', fetchuser, async (req, res) => {
    try {
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        let response = {};
        let xAxisValues = [];
        let loginData = [];
        let onlineUsersData = [];
        let colors = ["aqua", "green", "red", "yellow", "coral", "aquamarine", "deeppink"];
        let reqStartDate = moment(req.query.startDate 
            ? new Date(req.query.startDate) 
            : moment(new Date())
                .subtract(6, 'days')
            );
        reqStartDate.hours(0);
        reqStartDate.minutes(0);
        reqStartDate.seconds(0);
        reqStartDate.milliseconds(0);

        let reqEndDate = moment(req.query.endDate ? new Date(req.query.endDate) : new Date())
            .add(1, 'days')
        reqEndDate.hours(0);
        reqEndDate.minutes(0);
        reqEndDate.seconds(0);
        reqEndDate.milliseconds(0);

        while(reqStartDate < reqEndDate) {
            let startDate = reqStartDate;
            let endDate =  moment(reqStartDate)
                .add(1, 'days');
            let xAxisDate = moment(new Date(reqStartDate))
                .format('MMM-DD');
            xAxisValues.push(xAxisDate);
            
            var logins = await LoginHistory.find({date: {$gte: new Date(startDate), $lt: new Date(endDate)}});
            if(req.query.reqType === 'user' || req.query.reqType === 'both') {
                loginData.push(logins && logins.length ? logins.length : 0);
            }
            if(req.query.reqType === 'online' || req.query.reqType === 'both') {
                let onlineUsers = [];
                logins.map((user) => {
                    !onlineUsers.includes(user.userId.toString()) && onlineUsers.push(user.userId.toString());
                });
                onlineUsersData.push(onlineUsers && onlineUsers.length ? onlineUsers.length : 0);
            }

            reqStartDate = moment(new Date(reqStartDate))
                .add(1, 'days');
        }
        response.xAxisDates = xAxisValues;
        response.colors = colors;
        if(req.query.reqType === 'user' || req.query.reqType === 'both') {
            response.loginData = loginData;
        }
        if(req.query.reqType === 'online' || req.query.reqType === 'both') {
            response.onlineUsersData = onlineUsersData;
        }
        res.send(response);

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.get('/userhistory', fetchuser, async (req, res) => {
    try{
        let userHistory = await UserHistory.find({userId: req.user.id});
        await Promise.all(
            userHistory.sort((ob1, ob2) => {
                return new Date(ob1.date) > new Date(ob2.date) ? -1 : 1;
            })
        )
        res.send(userHistory);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.delete('/userhistory', fetchuser, async (req, res) => {
    try{
        let userHistory = await UserHistory.deleteMany({userId: req.user.id});
        if(userHistory) {
            await UserHistory.create({
                userId: req.user.id,
                action: "User history deleted",
            });
        }
        res.send(userHistory);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.get('/gamestats', fetchuser, async (req, res) => {
    try {
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        let stats = await GameDetails.find();
        let data = [];
        await Promise.all(
            stats.map(async (stat, i) => {
                let Stat = {
                    id: i + 1,
                    statsId: stat._id,
                    userId: stat.userId,
                    name: stat.userName,
                    tttStats: stat.tttStats,
                    con4Stats: stat.frnRowStats,
                }
                data.push(Stat);
            })
        );
        res.send({status: 'success', stats: data});
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.get('/delstats/:statsId', fetchuser, async (req, res) => {
    try {
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        let stats = await GameDetails.findOneAndDelete({_id: req.params.statsId});
        if(!stats) {
            res.send({success: false, msg: 'No stats found with the given Id'});
        }
        res.send(stats);
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

module.exports = router