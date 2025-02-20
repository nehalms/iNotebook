const mongoose = require('mongoose');
const { Schema } = mongoose;

const TasksSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    taskDesc: {
        type: String,
        required: true
    },
    src: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedDate: {
        type: Date,
    },
    createdDate : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('tasks', TasksSchema);