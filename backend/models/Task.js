const mongoose = require('mongoose');
const { Schema } = mongoose;

const TasksSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
    },
    subtasks: [
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }
    ],
    createdDate : {
        type: Date,
        default: Date.now
    }
});

TasksSchema.index({ user: 1 });
TasksSchema.index({ user: 1, createdDate: -1 });

module.exports = mongoose.model('tasks', TasksSchema);