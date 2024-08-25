const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const { roundCorners, enhance } = require('../Services/imagesService')
var multer  = require('multer');
var fs = require('fs');
var filePath = '../backend/uploads/'; 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../backend/uploads'); 
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/roundcorners', fetchuser, upload.single('image'), async (req, res) => {
    try {
        if((req.file.size / 1000000) > 10) {
            res.send({msg: 'File size is too large'});
            tmpPath = filePath + req.file.originalname
            console.log(tmpPath);
            fs.unlinkSync(tmpPath);
        }
        await roundCorners(req.user.id, req)
            .then((data) => {
                res.send({status: true, data: data}); 
                tmpPath = filePath + req.file.originalname
                console.log(tmpPath);
                fs.unlinkSync(tmpPath);
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

router.post('/enhance', fetchuser, upload.single('image'), async (req, res) => {
    try {
        if((req.file.size / 1000000) > 10) {
            res.send({msg: 'File size is too large'});
            tmpPath = filePath + req.file.originalname
            console.log(tmpPath);
            fs.unlinkSync(tmpPath);
        }
        await enhance(req.user.id, req)
            .then((data) => {
                res.send({status: true, data: data});
                tmpPath = filePath + req.file.originalname
                console.log(tmpPath);
                fs.unlinkSync(tmpPath);
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

module.exports = router