const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const SecurityPin = require('../models/SecurityPin')
const Notes = require('../models/Notes')
const { body, validationResult } = require("express-validator"); //to validate the inputs
const UserHistory = require('../models/UserHistory');
const scope = 'notes';

//Route-1 : Get all the notes : POST "/api/notes/fetchallnotes" => Login required
router.get('/fetchallnotes', fetchuser, checkPermission(scope), async (req, res)=> {
    try{
        // Use lean() for read-only query and select only needed fields
        const securityPin = await SecurityPin.findOne({user: req.user.id}).select('isPinVerified').lean();
        if(!securityPin || !securityPin.isPinVerified) {
            return res.status(401).json({ error: "Security pin not verified" });
        }
        const notes = await Notes.find({user: req.user.id}).lean();
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
    fetchuser, checkPermission(scope),  async (req, res)=> {

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
router.put('/updatenote/:id', fetchuser, checkPermission(scope),  async (req, res)=> {
    const {title, description, tag} = req.body;

    //Create a newNote object
    try{
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note to be updated and update it
        let note = await Notes.findById(req.params.id).select('user').lean(); //fetch note based on id sent in url
        if(!note){
            return res.status(404).send("Not Found");
        }

        if(note.user.toString() !== req.user.id){  // see that user id in note fetched and user id in request body is same
            return res.status(401).send("Not allowed");
        }
        // Parallelize update and history creation
        const [updatedNote] = await Promise.all([
            Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true}),
            UserHistory.create({
                userId: req.user.id,
                action: "Updated note",
            })
        ]);
        res.json({note: updatedNote});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
})



//Route-4 : delete an exsisting note : PUT "/api/notes/deletenote" => Login required
router.put('/deletenote/:id', fetchuser, checkPermission(scope),  async (req, res)=> {
    try{
        //Find the note to be deleted
        let note = await Notes.findById(req.params.id).select('user').lean(); //fetch note based on id sent in url
        if(!note){
            return res.status(404).send("Not Found");
        }

        if(note.user.toString() !== req.user.id){  // see that user id in note fetched and user id in request body is same
            return res.status(401).send("Not allowed");
        }  

        // Parallelize delete and history creation
        const [deletedNote] = await Promise.all([
            Notes.findByIdAndDelete(req.params.id),
            UserHistory.create({
                userId: req.user.id,
                action: "Deleted note",
            })
        ]);
        res.json({"Success" : "Note has been deleted", "note": deletedNote});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
    
})

router.post('/saveCord/:id/:xpos/:ypos', fetchuser, checkPermission(scope),  async (req, res) => {
    try{
        let id = req.params.id;
        let xpos = req.params.xpos;
        let ypos = req.params.ypos;
        if(!id || !xpos ||  !ypos) {
            res.status(400).send({msg: "Missing field parameters"});
        }

        let note = await Notes.findByIdAndUpdate(id, {xPos: xpos, yPos: ypos}, {new: true});
        if(note) {
            res.send({status: 'success', msg: 'cordinates updated successfully'});
            return;
        }
        res.send({status: 'success', msg: 'No note found with the given Id'});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Internal Server Error!!");
    }
});

module.exports = router