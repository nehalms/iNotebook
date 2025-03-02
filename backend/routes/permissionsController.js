const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const User = require("../models/User");
const { setAllPermissions, setPermissions, resetPermissions, resetAllPermissions, getUsers } = require('../Services/permissionsService');

router.get('/users', fetchuser, async (req, res) => {
    try {
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        await getUsers(req)
            .then((data) => {res.send(data)})
            .catch((err) => {res.status(500).send(err)});
    } catch(err){
        console.log(err.message);
        return res.status(500).send(err);
    }
});

router.put('/setall/:id', fetchuser, async (req, res)=> {
    try{
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        await setAllPermissions(req)
            .then((data) => {res.send(data)})
            .catch((err) => { res.status(500).send(err)});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send(err);
    }
});

router.put('/resetall/:id', fetchuser, async (req, res)=> {
    try{
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        await resetAllPermissions(req)
            .then((data) => {res.send(data)})
            .catch((err) => { res.status(500).send(err)});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send(err);
    }
});

router.put('/set/:id/:idx', fetchuser, async (req, res)=> {
    try{
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        await setPermissions(req)
            .then((data) => {res.send(data)})
            .catch((err) => { res.status(500).send(err)});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send(err);
    }
});

router.put('/reset/:id/:idx', fetchuser, async (req, res)=> {
    try{
        let adminUser = await User.findById(req.user.id);
        if(!adminUser || !adminUser.isAdmin) {
            res.status(404).send({ status: 'Error', message: 'Not Authorized'});
            return;
        }
        await resetPermissions(req)
            .then((data) => {res.send(data)})
            .catch((err) => { res.status(500).send(err)});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send(err);
    }
});


module.exports = router