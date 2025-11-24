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
        // Parallelize admin check and user fetch
        const [adminUser, Users] = await Promise.all([
            User.findById(req.user.id).select('isAdmin').lean(),
            User.find({email: {$ne: 'inotebook002@gmail.com'}}).select('_id name email date lastLogIn isActive').lean()
        ]);
        
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        
        // Parallelize all count queries
        const [notes, tasks, loginHistories, userHistories] = await Promise.all([
            Notes.countDocuments().lean(),
            Task.countDocuments().lean(),
            LoginHistory.countDocuments().lean(),
            UserHistory.countDocuments().lean()
        ]);
        
        // Get user IDs for aggregation
        const userIds = Users.map(u => u._id);
        
        // Use aggregation to get counts in a single query instead of N+1
        const [notesCounts, tasksCounts] = await Promise.all([
            Notes.aggregate([
                { $match: { user: { $in: userIds } } },
                { $group: { _id: '$user', count: { $sum: 1 } } }
            ]),
            Task.aggregate([
                { $match: { user: { $in: userIds } } },
                { $group: { _id: '$user', count: { $sum: 1 } } }
            ])
        ]);
        
        // Create maps for O(1) lookup
        const notesMap = new Map(notesCounts.map(item => [item._id.toString(), item.count]));
        const tasksMap = new Map(tasksCounts.map(item => [item._id.toString(), item.count]));
        
        // Sort users
        Users.sort((user1, user2) => user1.name.toLowerCase() > user2.name.toLowerCase() ? 1 : -1);
        
        // Build response data
        const data = Users.map((user, i) => ({
            id: i + 1,
            userId: user._id,
            name: user.name,
            email: user.email,
            date: user.date,
            lastLoggedOn: user.lastLogIn,
            isActive: user.isActive,
            notesCount: notesMap.get(user._id.toString()) || 0,
            tasksCount: tasksMap.get(user._id.toString()) || 0
        }));
        
        res.json({
            users: data,
            usersCount: Users.length,
            notesCount: notes,
            tasksCount: tasks,
            loginHistoryCount: loginHistories,
            userHistoryCount: userHistories
        });
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

router.get('/deluser/:userId', fetchuser, async (req, res) => {
    try {
        // Use lean() and select only needed field
        const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        if(!req.params.userId) {
            return res.send({success: false, msg: 'Please send the user Id'});
        }
        const user = await User.findOneAndDelete({_id: req.params.userId});
        if(!user) {
            return res.send({success: false, msg: 'No user found with the given Id'});
        }
        res.send(user);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

router.get('/graphData', fetchuser, async (req, res) => {
    try {
        // Use lean() and select only needed field
        const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
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

        // Build date ranges array
        const dateRanges = [];
        let currentDate = moment(reqStartDate);
        while(currentDate < reqEndDate) {
            const startDate = moment(currentDate);
            const endDate = moment(currentDate).add(1, 'days');
            dateRanges.push({
                start: new Date(startDate),
                end: new Date(endDate),
                label: startDate.format('MMM-DD')
            });
            currentDate = moment(currentDate).add(1, 'days');
        }

        // Fetch all login histories in one query with date range
        const allLogins = await LoginHistory.find({
            date: {
                $gte: new Date(reqStartDate),
                $lt: new Date(reqEndDate)
            }
        }).select('userId date').lean();

        // Process data for each date range
        dateRanges.forEach((range) => {
            xAxisValues.push(range.label);
            
            // Filter logins for this date range
            const dayLogins = allLogins.filter(login => {
                const loginDate = new Date(login.date);
                return loginDate >= range.start && loginDate < range.end;
            });

            if(req.query.reqType === 'user' || req.query.reqType === 'both') {
                loginData.push(dayLogins.length);
            }
            if(req.query.reqType === 'online' || req.query.reqType === 'both') {
                // Use Set for O(1) lookup instead of array includes
                const onlineUsersSet = new Set();
                dayLogins.forEach(login => {
                    onlineUsersSet.add(login.userId.toString());
                });
                onlineUsersData.push(onlineUsersSet.size);
            }
        });

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
        // Use lean() and sort in query for better performance
        const userHistory = await UserHistory.find({userId: req.user.id})
            .sort({ date: -1 })
            .lean();
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
        // Use lean() and select only needed fields
        const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        const stats = await GameDetails.find()
            .select('_id userId userName tttStats frnRowStats')
            .lean();
        
        const data = stats.map((stat, i) => ({
            id: i + 1,
            statsId: stat._id,
            userId: stat.userId,
            name: stat.userName,
            tttStats: stat.tttStats,
            con4Stats: stat.frnRowStats,
        }));
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

router.get('/dashboard', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const Events = require('../models/Events');
        
        // Parallelize all independent queries
        const [notesCount, tasks, gameStats, eventsCount, recentActivity] = await Promise.all([
            Notes.countDocuments({user: userId}),
            Task.find({user: userId}).select('subtasks').lean(),
            GameDetails.findOne({userId: userId}).select('tttStats frnRowStats').lean(),
            Events.countDocuments({user: userId}),
            UserHistory.find({userId: userId})
                .sort({date: -1})
                .limit(5)
                .select('action date')
                .lean()
        ]);
        
        // Calculate task statistics
        const totalTasks = tasks.length;
        let totalSubtasks = 0;
        let completedSubtasks = 0;
        tasks.forEach(task => {
            if (task.subtasks && task.subtasks.length > 0) {
                totalSubtasks += task.subtasks.length;
                completedSubtasks += task.subtasks.filter(subtask => subtask.completed).length;
            }
        });
        
        const activeSubtasks = totalSubtasks - completedSubtasks;
        const completionRate = totalSubtasks > 0 
            ? Math.round((completedSubtasks / totalSubtasks) * 100) 
            : 0;
        
        let gamesPlayed = 0;
        let tttStats = { played: 0, won: 0, lost: 0 };
        let con4Stats = { played: 0, won: 0, lost: 0 };
        if (gameStats) {
            tttStats = {
                played: gameStats.tttStats.played || 0,
                won: gameStats.tttStats.won || 0,
                lost: gameStats.tttStats.lost || 0
            };
            con4Stats = {
                played: gameStats.frnRowStats.played || 0,
                won: gameStats.frnRowStats.won || 0,
                lost: gameStats.frnRowStats.lost || 0
            };
            gamesPlayed = (tttStats.played || 0) + (con4Stats.played || 0);
        }
        
        // Format recent activity
        const formattedActivity = recentActivity.map(activity => ({
            id: activity._id.toString(),
            type: activity.action,
            title: activity.action,
            timestamp: moment(activity.date).fromNow(),
            date: activity.date
        }));
        
        res.json({
            status: 1,
            data: {
                notes: {
                    total: notesCount
                },
                tasks: {
                    total: totalTasks,
                    totalSubtasks: totalSubtasks,
                    completedSubtasks: completedSubtasks,
                    activeSubtasks: activeSubtasks,
                    completionRate: completionRate
                },
                games: {
                    totalPlayed: gamesPlayed,
                    ticTacToe: tttStats,
                    connect4: con4Stats
                },
                calendar: {
                    eventsCount: eventsCount
                },
                recentActivity: formattedActivity
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

module.exports = router