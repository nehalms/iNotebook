const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true
    },
    permissions : {
        type: [String],
    },
    date : {
        type: Date,
        default: Date.now
    },
    lastLogIn : {
        type: Date,
        default: Date.now
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    isActive : {
        type: Boolean,
        default: true
    }
});

UserSchema.index({ email: 1 });
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ isAdmin: 1 });

const User = mongoose.model('user', UserSchema);
module.exports = User;