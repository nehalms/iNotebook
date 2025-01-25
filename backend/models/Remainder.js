const mongoose = require('mongoose');
const { Schema } = mongoose;

const RemainderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title : {
        type: String,
    },
    content : {
        type: String,
    },
    remainderDate: {
        type: Date,
    },
    cronExp: {
        type: String,
    },
    isComp: {
        type: Boolean,
        default: false
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('remainders', RemainderSchema);