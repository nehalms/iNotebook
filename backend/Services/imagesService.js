const cloudinary = require('cloudinary')
const moment = require('moment')
cloudinary.v2.config({
    cloud_name: 'djrw2o5s6',
    api_key: '439463939241154',
    api_secret: 'qYkg0-jX9UjYwuOE63bQwqzRY9A',
    secure: true,
  });

const uploadImage = async (id, fileName, timeStamp) => {
    let uploadResult = await cloudinary.v2.uploader
        .upload(
            `./uploads/${fileName}`, {
                public_id: id+timeStamp,
            }
        )
        .catch((error) => {
            console.log(error);
            return error;
        });
    return uploadResult;
}

const deleteImage = (id) => {
    cloudinary.v2.api
        .delete_resources([id], 
        { type: 'upload', resource_type: 'image' })
}
  
async function roundCorners(id, req) {
    return new Promise(async (resolve, reject) => {
        try {
            let fileName = req.file.originalname;
            let timeStamp = moment(new Date()).format();
            let uploadResult = await uploadImage(id, fileName, timeStamp);
            
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
                deleteImage(uploadResult.public_id);
                resolve({
                    name: uploadResult.original_filename,
                    url: url,
                });
            } else {
                reject(uploadResult);
            }
        } catch (err) {
            console.log(err);
            reject({err: 'Internal server error occured'});
        }
    });
}

async function enhance(id, req) {
    return new Promise( async (resolve, reject) => {
        try {
            let fileName = req.file.originalname;
            let timeStamp = moment(new Date()).format();
            let uploadResult = await uploadImage(id, fileName, timeStamp);
    
            if(uploadResult) {
                let url = cloudinary.v2.url(uploadResult.public_id, {effect: "enhance"});
                deleteImage(uploadResult.public_id);
                resolve({
                    name: uploadResult.original_filename,
                    url: url,
                });
            } else {
                reject(uploadResult);
            }
        } catch (err) {
            console.log(err);
            reject({err: 'Internal server error occured'});
        }
    });
}

module.exports = {
    roundCorners,
    enhance
}