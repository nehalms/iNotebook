const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameDetails = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userName: {
        type: String,
    },
    tttStats: {
        type: Map,
        of: Number,
    },
    frnRowStats: {
        type: Map,
        of: Number,
    },
    date: {
        type: Date,
        default: new Date(),
    }
});

gameDetails.index({ userId: 1 });

module.exports = mongoose.model('gameDetails', gameDetails);