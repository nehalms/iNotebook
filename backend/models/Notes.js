const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    tag : {
        type: String,
        default: "General"
    },
    xPos: {
        type: Number,
        default: 0
    },
    yPos: {
        type: Number,
        default: 0
    },
    date : {
        type: Date,
        default: Date.now
    }
});

NotesSchema.index({ user: 1 });
NotesSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('notes', NotesSchema);