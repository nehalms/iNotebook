const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    },
    start : {
        type: String,
        required: true
    },
    end : {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
});

EventsSchema.index({ user: 1 });
EventsSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('events', EventsSchema);