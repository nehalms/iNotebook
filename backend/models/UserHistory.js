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

UserHistorySchema.index({ userId: 1 });
UserHistorySchema.index({ userId: 1, date: -1 });

const UserHistory = mongoose.model('userhistory', UserHistorySchema);
module.exports = UserHistory;