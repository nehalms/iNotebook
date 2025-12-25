const mongoose = require('mongoose');
const { Schema } = mongoose;

// OTP schema for auth flows (login, signup, forgot-password)
const authOTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  sessionKey: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['login', 'signup', 'forgot-password'],
    required: true,
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
}, { collection: 'authOTPs' });

// Compound index for efficient lookups
authOTPSchema.index({ email: 1, sessionKey: 1 }, { unique: true });

module.exports = mongoose.model('AuthOTP', authOTPSchema);

