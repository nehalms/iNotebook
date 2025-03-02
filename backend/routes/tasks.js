const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const { body, validationResult } = require("express-validator"); //to validate the inputs
const UserHistory = require('../models/UserHistory');
const Task = require('../models/Task');
const Folder = require('../models/Folder');
const decrypt = require('../middleware/decrypt');
const scope = 'tasks';

router.get('/', fetchuser, checkPermission(scope),  async (req, res)=> {
    try{
        if( !req.query.src || req.query.src.toString().trim() == "" ) {
            return res.status(404).send({ error: "Missing folder name" });
        }
        let src = req.query.src;
        const tasks = await Task.find({ $and: [{user: req.user.id}, {src: src}]});
        if(!tasks) {
            return res.send({error: "No tasks found for the given user id"});
        } else {
            return res.json({status: 1, tasks});
        }
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

router.post('/addTask', decrypt,
    [
        body("src", "Folder(source) name cannot be empty").isLength({ min: 3 }),
        body("taskDesc", "description must be 5 characters").isLength({ min: 5 }),
    ], 
    fetchuser, checkPermission(scope),  async (req, res)=> {

        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {src, taskDesc} = req.body;
            let folder = await Folder.findOne({user: req.user.id});
            if(!folder || !folder.folders.includes(src)) {
                return res.send({ error: `Folder ${src} not found`});
            }
            const newTask = new Task({
                user:req.user.id,
                taskDesc: taskDesc,
                src: src,
            })
            const task = await newTask.save();
            await UserHistory.create({
                userId: req.user.id,
                action: "Created a new task",
            });
            res.send({status: 1, msg: "New Task added", task});
        }
        catch(err){
            console.log(err.message);
            return res.status(500).send("Internal Server Error!!");
        }
})


router.put('/updatetask/:id', decrypt,
    [
        body("src", "Folder(source) name cannot be empty").isLength({ min: 3 }),
        body("taskDesc", "description must be 5 characters").isLength({ min: 5 }),
    ], 
    fetchuser, checkPermission(scope),  async (req, res)=> {
        
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {src, taskDesc} = req.body;
        const newTask = {};
        if(src){newTask.src = src};
        if(taskDesc){newTask.taskDesc = taskDesc};

        let task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send({ error: "No task Not Found with given Id" });
        }

        if(task.user.toString() !== req.user.id || task.src !== newTask.src){
            return res.status(401).send({ error: "Not allowed to update the task" });
        }
        task = await Task.findByIdAndUpdate(req.params.id, {$set: newTask}, {new: true})
        await UserHistory.create({
            userId: req.user.id,
            action: "Updated task",
        });
        res.json({status: 1, msg: "Task updated", task});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})


router.put('/updatestatus/:id', fetchuser, checkPermission(scope),  async (req, res) => {
    try{
        let task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send({ error: "No task Not Found with given Id" });
        }

        if(task.user.toString() !== req.user.id){ 
            return res.status(401).send({ error: "Not allowed to update the task status" });
        }
        let completed = req.query.comp;
        task = await Task.findByIdAndUpdate(req.params.id, {completed: completed, completedDate: completed == "true" ? new Date() : null}, {new: true})
        await UserHistory.create({
            userId: req.user.id,
            action: "Updated task status",
        });
        res.json({status: 1, msg: "Task status updated", task});

    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})


router.delete('/deletetask/:id', fetchuser, checkPermission(scope),  async (req, res)=> {
    try{
        let task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send({ error: "No task Not Found with given Id" });
        }

        if(task.user.toString() !== req.user.id){
            return res.status(401).send({ error: "Not allowed to delete the task" });
        }  

        if(!task.completed) {
            return res.send({ error: "Incomplete task cannot be deleted" });
        }

        task = await Task.findByIdAndDelete(req.params.id)
        await UserHistory.create({
            userId: req.user.id,
            action: "Deleted task",
        });
        res.json({status: 1, msg : "Task deleted", task});
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
    
})


router.get('/folders', fetchuser, checkPermission(scope),  async (req, res) => {
    try {
        let folder = await Folder.findOne({user: req.user.id});
        if(!folder) {
            return res.send({error: "No folders found for the given user id"});
        } else {
            return res.send({status: 1, msg: "Folder fetched", folders: folder.folders});
        }
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})


router.post('/addfolder', fetchuser, checkPermission(scope),  async (req, res) => {
    try {
        if( !req.query.src || req.query.src.toString().trim() == "") {
            return res.status(404).send({ error: "Missing folder name" });
        }
        let src = req.query.src;
        let folderList = [];
        let folder = await Folder.findOne({user: req.user.id});
        if(!folder) {
            folderList.push(src.toString().trim());
            folder = await Folder.create({
                user: req.user.id,
                folders: folderList
            })
            return res.send({status: 1, msg: 'Folder created', folder});
        } else {
            folderList = folder.folders;
            if(folderList.includes(src.toString().trim())) {
                return res.send({error: `Folder ${src} already exists`});
            }   
            folderList.push(src.toString().trim());
            folder = await Folder.findOneAndUpdate({user: req.user.id}, {folders: folderList}, {new: true});
            await UserHistory.create({
                userId: req.user.id,
                action: `Created folder ${src}`,
            });
            return res.send({status: 1, msg: 'Folder created', folder});
        }
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

router.post('/updatefolder', fetchuser, checkPermission(scope),  async (req, res) => {
    try {
        if( !req.query.src || req.query.src.toString().trim() == "" || !req.query.dest || req.query.dest.toString().trim() == "" ) {
            return res.status(404).send({ error: "Missing folder name" });
        }
        let src = req.query.src.toString().trim();
        let dest = req.query.dest.toString().trim();
        let folderList = [];
        let folder = await Folder.findOne({user: req.user.id});
        if(!folder) {
            return res.send({error: "No folders found for the given user id"});
        } else {
            folderList = folder.folders;
            if(!folderList.includes(src)) {
                return res.send({error: `Folder ${src} not found`});
            }  
            if(folderList.includes(dest)) {
                return res.send({error: `Folder ${dest} already exists`});
            } 
            folderList = folderList.filter(item => item != src.toString().trim());
            folderList.push(dest);
            folder = await Folder.findOneAndUpdate({user: req.user.id}, {folders: folderList}, {new: true});
            let tasks = await Task.find({ $and: [{user: req.user.id}, {src: src}]})
            if(tasks && tasks.length){
                await Promise.all(
                    tasks.map(async (task) => {
                        task = await Task.findByIdAndUpdate(task._id, {src: dest}, {new: true});
                    })
                );
            }
            await UserHistory.create({
                userId: req.user.id,
                action: `Updated folder from ${src} to ${dest}`,
            });
            return res.send({status: 1, msg: 'Folder Updated', folder});
        }
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

router.delete('/rmvfolder', fetchuser, checkPermission(scope),  async (req, res) => {
    try {
        if( !req.query.src || req.query.src.toString().trim() == "") {
            return res.status(404).send({ error: "Missing folder name" });
        }
        let src = req.query.src;
        let folder = await Folder.findOne({user: req.user.id});
        if(!folder) {
            return res.send({error: "No folders found for the given user id"});
        } else {
            folderList = folder.folders;
            if(!folderList.includes(src.toString().trim())) {
                return res.send({error: `Folder ${src} not found`});
            } 
            let tasks = await Task.find({ $and: [{user: req.user.id}, {src: src}]})
            let inCompTask = tasks.filter((task) => task.completed == false)
            if(inCompTask && inCompTask.length) {
                return res.send({error: `Folder ${src} has some Incomplete tasks`})
            }
            if(tasks && tasks.length){
                await Promise.all(
                    tasks.map(async (task) => {
                        task = await Task.findByIdAndDelete(task._id);
                    })
                );
            }
            folderList = folderList.filter(item => item != src.toString().trim());
            folder = await Folder.findOneAndUpdate({user: req.user.id}, {folders: folderList}, {new: true});
            await UserHistory.create({
                userId: req.user.id,
                action: `Deleted folder ${src}`,
            });
            return res.send({status: 1, msg: 'Folder Deleted', folder});
        }
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})



module.exports = router