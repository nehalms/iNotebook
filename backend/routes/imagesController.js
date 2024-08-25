const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const moment = require('moment')
const { roundCorners, enhance } = require('../Services/imagesService')
const Image = require('../models/ImagesInfo')
const multer  = require('multer');
const upload = multer();

router.post('/roundcorners', fetchuser, upload.single('image'), async (req, res) => {
    try {
        if((req.file.size / 1000000) > 10) {
            res.send({msg: 'File size is too large'});
        }
        await roundCorners(req.user.id, req)
            .then(async (data) => {
                res.send({status: true, data: data}); 
                const obj = await Image.findOne({userId: req.user.id}).select('count');
                if(obj) {
                    await Image.findOneAndUpdate(
                        {userId: req.user.id}, 
                        {count: obj.count + 1, date: moment(new Date()).format()}, 
                        {new: true}
                    );
                } else {
                    await Image.create({
                        userId: req.user.id,
                        count: 1,
                    });
                }
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
        await enhance(req.user.id, req)
            .then(async (data) => {
                res.send({status: true, data: data});
                const obj = await Image.findOne({userId: req.user.id}).select('count');
                if(obj) {
                    await Image.findOneAndUpdate(
                        {userId: req.user.id}, 
                        {count: obj.count + 1, date: moment(new Date()).format()}, 
                        {new: true}
                    );
                } else {
                    await Image.create({
                        userId: req.user.id,
                        count: 1,
                    });
                }
            })
            .catch((error) => res.status(500).send(error));
    } catch (err) {
        console.log("Error**", err);
        res.status(500).send(err);
    }
});

module.exports = router