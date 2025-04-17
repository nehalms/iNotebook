const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionEntrySchema = new Schema({
  name: String,
  ip: String,
  date: { type: Date, default: Date.now },
}, { _id: false });

const otpEntrySchema = new Schema({
  code: String,
  expiryTime: Date,
}, { _id: false });

const appStateSchema = new Schema({
  _id: { type: String, default: 'singleton' },
  liveUser: {
    type: Map,
    of: sessionEntrySchema,
    default: {},
  },
  otpManager: {
    type: Map,
    of: otpEntrySchema,
    default: {},
  },
}, { collection: 'appState' });

module.exports = mongoose.model('AppState', appStateSchema);
