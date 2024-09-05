const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserHistorySchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    action : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    }
});
const UserHistory = mongoose.model('userhistory', UserHistorySchema);
module.exports = UserHistory;