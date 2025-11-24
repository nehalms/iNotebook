const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const { body, validationResult } = require("express-validator"); //to validate the inputs
const UserHistory = require('../models/UserHistory');
const Task = require('../models/Task');
const Folder = require('../models/Folder');
const SecurityPin = require('../models/SecurityPin')

const decrypt = require('../middleware/decrypt');
const scope = 'tasks';

router.get('/', fetchuser, checkPermission(scope),  async (req, res)=> {
    try{
        // Use lean() for read-only query and select only needed fields
        const securityPin = await SecurityPin.findOne({user: req.user.id}).select('isPinVerified').lean();
        if(!securityPin || !securityPin.isPinVerified) {
            return res.status(401).json({ error: "Security pin not verified" });
        }
        const tasks = await Task.find({ user: req.user.id }).lean();
        if(!tasks || tasks.length === 0) {
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

router.post('/addTask',
    [
        body("data", "Missing body data").isLength({ min: 1 }),
    ], 
    fetchuser, checkPermission(scope),  async (req, res)=> {

    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {data} = req.body;
        const newTask = new Task({
            user: req.user.id,
            title: data.title,
            priority: data.priority,
            subtasks: data.subtasks,
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


router.put('/updatetask/:id',
    [
        body("data", "Missing body data").isLength({ min: 1 }),
    ], 
    fetchuser, checkPermission(scope),  async (req, res)=> {
        
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { data } = req.body;

        let task = await Task.findById(req.params.id).select('user').lean();
        if(!task){
            return res.status(404).send({ error: "No task Not Found with given Id" });
        }

        if(task.user.toString() !== req.user.id){
            return res.status(401).send({ error: "Not allowed to update the task" });
        }
        // Parallelize update and history creation
        await Promise.all([
            Task.findByIdAndUpdate(req.params.id, {$set: data}, {new: true}),
            UserHistory.create({
                userId: req.user.id,
                action: "Updated task",
            })
        ]);
        res.json({status: 1, msg: "Task updated"});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

router.delete('/deletetask/:id', fetchuser, checkPermission(scope),  async (req, res)=> {
    try{
        let task = await Task.findById(req.params.id).select('user subtasks').lean();
        if(!task){
            return res.status(404).send({ error: "No task Not Found with given Id" });
        }

        if(task.user.toString() !== req.user.id){
            return res.status(401).send({ error: "Not allowed to delete the task" });
        }  

        if(!task.subtasks.every(subtask => subtask.completed)){ 
            return res.send({ error: "Incomplete task cannot be deleted" });
        }

        // Parallelize delete and history creation
        await Promise.all([
            Task.findByIdAndDelete(req.params.id),
            UserHistory.create({
                userId: req.user.id,
                action: "Deleted task",
            })
        ]);
        res.json({status: 1, msg : "Task deleted"});
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
    
})

module.exports = router