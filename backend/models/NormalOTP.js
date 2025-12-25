const mongoose = require('mongoose');
const { Schema } = mongoose;

// OTP schema for normal flows (security-pin, etc.)
const normalOTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['security-pin', 'email-verification', 'other'],
    default: 'security-pin',
  },
  expiryTime: {
    type: Date,
    required: true,
    index: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 * 60, // TTL: 10 minutes (in seconds)
  },
}, { collection: 'normalOTPs' });

module.exports = mongoose.model('NormalOTP', normalOTPSchema);

