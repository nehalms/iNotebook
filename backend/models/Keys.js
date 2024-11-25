const mongoose = require('mongoose');
const { Schema } = mongoose;

const Keys = new Schema({
    publicKey: {
        type: String,
    },
    privateKey: {
        type: String,
    },
});

module.exports = mongoose.model('keys', Keys);