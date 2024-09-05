const cloudinary = require('cloudinary')
const moment = require('moment');
const UserHistory = require('../models/UserHistory');
cloudinary.v2.config({
    cloud_name: 'djrw2o5s6',
    api_key: '439463939241154',
    api_secret: 'qYkg0-jX9UjYwuOE63bQwqzRY9A',
    secure: true,
  });

const uploadImage = async (buffer) => {
    return await new Promise(async (resolve, reject) => {
        let cld_upload_stream = cloudinary.v2.uploader.upload_stream({folder: "iNotebook"},
            (error, res) => {
                if(error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(res);
                }
            }
        )
        // streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
        cld_upload_stream.write(buffer);
        cld_upload_stream.end();
    });
}

async function deleteImage(req) {
    return new Promise(async (resolve, reject) => {
        cloudinary.v2.api
            .delete_resources_by_prefix('iNotebook', function (error, result) {
                if(error) {
                    reject({error: "Error in deleting the image"});
                    console.log(error);
                } else {
                    if(Object.keys(result.deleted).length > 0) {
                        UserHistory.create({
                            userId: req.user.id,
                            action: "Images Deleted in server",
                        });
                    }
                    resolve({msg: Object.keys(result.deleted).length ? "Images deleted Successfully" : "No images to delete"});
                    console.log(result);
                }
            });
    })
}
  
async function roundCorners(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let uploadResult = await uploadImage(req.file.buffer);
            if(uploadResult){
                let transformation = [
                    {gravity: "auto", width: 500, crop: "auto"},
                    {background: "transparent"},
                ]
        
                if(req.query.setMax && req.query.setMax === 'true') {
                    transformation.push({radius: "max"});
                } else {
                    transformation.push({radius: `${req.query.tl}:${req.query.tr}:${req.query.bl}:${req.query.br}`})
                }
        
                let url = cloudinary.v2.url(uploadResult.public_id, {transformation: transformation});
                await UserHistory.create({
                    userId: req.user.id,
                    action: "Image transformation (Round Corners)",
                });
                resolve({
                    name: uploadResult.original_filename,
                    url: url,
                });
            } else {
                reject({error: 'Image uploading failed'});
            }
        } catch (error) {
            console.log(error);
            reject({error: 'Internal server error occured'});
        }
    });
}

async function enhance(req) {
    return new Promise( async (resolve, reject) => {
        try {
            let uploadResult = await uploadImage(req.file.buffer);
    
            if(uploadResult) {
                let url = cloudinary.v2.url(uploadResult.public_id, {effect: "enhance"});
                await UserHistory.create({
                    userId: req.user.id,
                    action: "Image transformation (Enhance)",
                });
                resolve({
                    name: uploadResult.original_filename,
                    url: url,
                });
            } else {
                reject({error: 'Image uploading failed'});
            }
        } catch (error) {
            console.log(error);
            reject({error: 'Internal server error occured'});
        }
    });
}

module.exports = {
    roundCorners,
    enhance,
    deleteImage
}