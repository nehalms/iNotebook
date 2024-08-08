const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const User = require("../models/User");
const Notes = require('../models/Notes')


router.get('/users', fetchuser, async (req, res)=> {
    try{
        const Users = await User.find();
        let data = [];
        await Promise.all(
            Users.map(async (user, i) => {
                if(user.email === 'iNotebook@gmail.com') {
                    return;
                }
                let User = {
                    id: i + 1,
                    name: user.name,
                    email: user.email,
                    date: user.date,
                }
                const countOfUserNotes = await Notes.find({user: user.id});
                User.count = countOfUserNotes.length;
                data.push(User);  
            })
        );
        res.json(data);
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

module.exports = router