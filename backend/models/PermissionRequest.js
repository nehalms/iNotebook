const mongoose = require('mongoose');
const { Schema } = mongoose;

const PermissionRequestSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    permission: {
        type: String,
        required: true,
        enum: ['notes', 'tasks', 'images', 'games', 'messages', 'news', 'calendar']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    adminComment: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

PermissionRequestSchema.index({ user: 1, permission: 1, status: 1 });
PermissionRequestSchema.index({ status: 1 });

const PermissionRequest = mongoose.model('permissionrequest', PermissionRequestSchema);
module.exports = PermissionRequest;

