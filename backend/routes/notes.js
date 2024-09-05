const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const Notes = require('../models/Notes')
const { body, validationResult } = require("express-validator"); //to validate the inputs
const UserHistory = require('../models/UserHistory');

//Route-1 : Get all the notes : POST "/api/notes/fetchallnotes" => Login required
router.get('/fetchallnotes', fetchuser, async (req, res)=> {
    try{
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})

//Route-2 : Add new notes : POST "/api/notes/addnote" => Login required
router.post('/addnote',
    [
        body("title", "Enter a valid title").isLength({ min: 3}),
        body("description", "description must be 5 characters").isLength({ min: 5 }),
    ], 
    fetchuser, async (req, res)=> {

        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const {title, description, tag} = req.body;

            const note = new Notes({
                user:req.user.id, title, description, tag 
            })
            const savedNote = await note.save();
            await UserHistory.create({
                userId: req.user.id,
                action: "Created note",
            });
            res.send(savedNote);
        }
        catch(err){
            console.log(err.message);
            return res.status(500).send("Internal Server Error!!");
        }
})


//Route-3 : Update an exsisting note : PUT "/api/notes/updatenote" => Login required
router.put('/updatenote/:id', fetchuser, async (req, res)=> {
    const {title, description, tag} = req.body;

    //Create a newNote object
    try{
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note to be updated and update it
        let note = await Notes.findById(req.params.id) //fetch note based on id sent in url
        if(!note){
            res.status(404).send("Not Found");
        }

        if(note.user.toString() !== req.user.id){  // see that user id in note fetched and user id in request body is same
            return res.status(401).send("Not allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        await UserHistory.create({
            userId: req.user.id,
            action: "Updated note",
        });
        res.json({note});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})



//Route-4 : delete an exsisting note : PUT "/api/notes/deletenote" => Login required
router.put('/deletenote/:id', fetchuser, async (req, res)=> {
    try{
        //Find the note to be deleted
        let note = await Notes.findById(req.params.id) //fetch note based on id sent in url
        if(!note){
            res.status(404).send("Not Found");
        }

        if(note.user.toString() !== req.user.id){  // see that user id in note fetched and user id in request body is same
            return res.status(401).send("Not allowed");
        }  

        note = await Notes.findByIdAndDelete(req.params.id)
        await UserHistory.create({
            userId: req.user.id,
            action: "Deleted note",
        });
        res.json({"Success" : "Note has been deleted", "note": note});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
    
})

module.exports = router