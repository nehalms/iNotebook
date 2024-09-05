const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const User = require("../models/User");
const Notes = require('../models/Notes')
const LoginHistory = require('../models/LoginHistory')
const moment = require('moment');
const UserHistory = require('../models/UserHistory');

router.get('/users', fetchuser, async (req, res)=> {
    try{
        const Users = await User.find({email: {$ne: 'inotebook002@gmail.com'}});
        const notes = await Notes.find();
        Users.sort((user1, user2) => {return user1.name.toLowerCase() > user2.name.toLowerCase() ? 1 : -1})
        let response = {};
        let data = [];
        await Promise.all(
            Users.map(async (user, i) => {
                let User = {
                    id: i + 1,
                    name: user.name,
                    email: user.email,
                    date: user.date,
                    lastLoggedOn: user.lastLogIn,
                    isActive: user.isActive,
                }
                const countOfUserNotes = await Notes.find({user: user.id});
                User.count = countOfUserNotes.length;
                data.push(User);  
            })
        );
        response.users = data;
        response.usersCount = Users.length;
        response.notesCount = notes.length;
        res.json(response);
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.get('/graphData', fetchuser, async (req, res) => {
    try {
        let response = {};
        let xAxisValues = [];
        let loginData = [];
        let notesData = [];
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
            
            if(req.query.reqType === 'user' || req.query.reqType === 'both') {
                let logins = await LoginHistory.find({date: {$gte: new Date(startDate), $lt: new Date(endDate)}});
                loginData.push(logins && logins.length ? logins.length : 0);
            }
            if(req.query.reqType === 'notes' || req.query.reqType === 'both') {
                let noteData = await Notes.find({date: {$gte: startDate, $lt: endDate}});
                notesData.push(noteData && noteData.length ? noteData.length : 0);
            }

            reqStartDate = moment(new Date(reqStartDate))
                .add(1, 'days');
        }
        response.xAxisDates = xAxisValues;
        response.colors = colors;
        if(req.query.reqType === 'user' || req.query.reqType === 'both') {
            response.loginData = loginData;
        }
        if(req.query.reqType === 'notes' || req.query.reqType === 'both') {
            response.notesData = notesData;
        }
        res.send(response);

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.get('/userhistory', fetchuser, async (req, res) => {
    try{
        let userHistory = await UserHistory.find({userId :req.user.id});
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

module.exports = router