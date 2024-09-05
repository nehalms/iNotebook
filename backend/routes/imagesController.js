const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const { roundCorners, enhance, deleteImage, generateBackground } = require('../Services/imagesService')
const multer  = require('multer');
const upload = multer();

router.delete('/delete', fetchuser, async (req, res) => {
    try{
        deleteImage(req)
        .then((data) => {res.send({success: true, data: data})})
        .catch((err) => {res.status(500).send(err)})
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

router.post('/roundcorners', fetchuser, upload.single('image'), async (req, res) => {
    try {
        if((req.file.size / 1000000) > 10) {
            res.send({msg: 'File size is too large'});
        }
        await roundCorners(req)
            .then(async (data) => {
                res.send({success: true, data: data}); 
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
        }
        await enhance(req)
            .then(async (data) => {
                res.send({success: true, data: data});
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

module.exports = router