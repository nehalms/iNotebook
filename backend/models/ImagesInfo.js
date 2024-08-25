const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    count : {
        type: Number,
    },
    date : {
        type: Date,
        default: Date.now
    }
});
const ImageInfo = mongoose.model('imageinfo', ImageSchema);
module.exports = ImageInfo;