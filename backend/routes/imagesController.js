const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const moment = require('moment')
const { roundCorners, enhance, deleteImage, generateBackground } = require('../Services/imagesService')
const Image = require('../models/ImagesInfo')
const multer  = require('multer');
const upload = multer();

const addCount = async (id) => {
    try {
        const obj = await Image.findOne({userId: id}).select('count');
        if(obj) {
            await Image.findOneAndUpdate(
                {userId: id}, 
                {count: obj.count + 1, date: moment(new Date()).format()}, 
                {new: true}
            );
        } else {
            await Image.create({
                userId: id,
                count: 1,
            });
        }
    } catch (err) {
        console.log("Error**", err);
    }
}

router.delete('/delete', fetchuser, async (req, res) => {
    try{
        deleteImage()
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
                addCount(req.user.id);
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
                addCount(req.user.id);
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

module.exports = router