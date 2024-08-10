const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const User = require("../models/User");
const Notes = require('../models/Notes')
const LoginHistory = require('../models/LoginHistory')
const moment = require('moment')

router.get('/users', fetchuser, async (req, res)=> {
    try{
        const Users = await User.find({email: {$ne: 'iNotebook@gmail.com'}});
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
        for(let i=6; i>=0; i--) {
            let startDate = moment(new Date())
                .subtract(i, 'days')
                .add(6, 'hours');
            startDate.hours(0);
            startDate.minutes(0);
            startDate.seconds(0);
            startDate.milliseconds(0);
            let endDate =  moment(new Date())
                .subtract(i-1, 'days')
                .add(6, 'hours');
            endDate.hours(0);
            endDate.minutes(0);
            endDate.seconds(0);
            endDate.milliseconds(0);
            let xAxisDate = moment(new Date())
                .subtract(i, 'days')
                .format('MMM-DD');
            xAxisValues.push(xAxisDate);
            
            let logins = await LoginHistory.find({date: {$gte: new Date(startDate), $lt: new Date(endDate)}});
            loginData.push(logins && logins.length ? logins.length : 0);

            let noteData = await Notes.find({date: {$gte: startDate, $lt: endDate}});
            notesData.push(noteData && noteData.length ? noteData.length : 0);

            console.log(i, startDate, endDate);
            console.log('logins', i, logins);
            console.log('notes', i, noteData);
        }
        response.xAxisDates = xAxisValues;
        response.loginData = loginData;
        response.notesData = notesData;
        response.colors = colors;
        res.send(response);

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

module.exports = router