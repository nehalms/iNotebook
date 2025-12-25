const mongoose = require('mongoose');
const { Schema } = mongoose;

// Live user session schema
const liveUserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2 * 60, // TTL: 2 minutes (in seconds) - users inactive for 2 minutes are removed
  },
}, { collection: 'liveUsers' });

// Compound index for efficient lookups
liveUserSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model('LiveUser', liveUserSchema);

