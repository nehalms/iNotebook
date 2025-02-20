const mongoose = require('mongoose');
const { Schema } = mongoose;

const FolderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    folders: {
        type: [String]
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('folder', FolderSchema);