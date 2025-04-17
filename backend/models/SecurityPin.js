const mongoose = require('mongoose');
const { Schema } = mongoose;

const PinSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    pin: {
        type: String,
        required: true
    },
    isPinVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const SecurityPin = mongoose.model('securitypin', PinSchema);
module.exports = SecurityPin;