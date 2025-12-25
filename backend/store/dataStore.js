const AppState = require('../models/AppState');

async function updateLiveUser(userId, deviceId, { name, ip }) {
  const key = `${userId}::${deviceId}`;
  await AppState.findOneAndUpdate(
    { _id: 'singleton' },
    { $set: { [`liveUser.${key}`]: { name, ip, date: new Date() } } },
    { upsert: true, new: true },
  );
}

async function getLiveUsers() {
  const doc = await AppState.findById('singleton').lean();
  return doc.liveUser;
}

async function setLiveUsers(usersMap) {
  await AppState.updateOne(
    { _id: 'singleton' },
    { $set: { liveUser: usersMap } },
  );
}


// Legacy function - for backward compatibility with security pin and EmailController
async function updateOTP(email, { code, expiryTime }) {
  const doc = await AppState.findById('singleton');
  if (!doc) throw new Error('AppState not initialized');
  const normalizedEmail = email.toString().split(".").join("");
  doc.otpManager.set(normalizedEmail, { 
    code, 
    expiryTime,
    isVerified: false,
    type: 'security-pin',
    createdAt: new Date()
  });
  await doc.save();
}

// Legacy function - for backward compatibility
async function getOTP(email) {
  const doc = await AppState.findById('singleton').lean();
  const normalizedEmail = email.toString().split(".").join("");
  return doc.otpManager[normalizedEmail] || null;
}

// New OTP functions for auth flows (login, signup, forgot-password)
// Key format: email + sessionKey
async function saveOTP(email, sessionKey, { code, expiryTime, type }) {
  const doc = await AppState.findById('singleton');
  if (!doc) throw new Error('AppState not initialized');
  const normalizedEmail = email.toString().split(".").join("");
  const key = `${normalizedEmail}::${sessionKey}`;
  doc.otpManager.set(key, { 
    code, 
    expiryTime,
    isVerified: false,
    type: type || 'login',
    createdAt: new Date()
  });
  await doc.save();
}

async function getOTPByKey(email, sessionKey) {
  const doc = await AppState.findById('singleton').lean();
  const normalizedEmail = email.toString().split(".").join("");
  const key = `${normalizedEmail}::${sessionKey}`;
  return doc.otpManager[key] || null;
}

async function verifyOTPByKey(email, sessionKey) {
  const doc = await AppState.findById('singleton');
  if (!doc) throw new Error('AppState not initialized');
  const normalizedEmail = email.toString().split(".").join("");
  const key = `${normalizedEmail}::${sessionKey}`;
  const otpEntry = doc.otpManager.get(key);
  if (otpEntry) {
    otpEntry.isVerified = true;
    doc.otpManager.set(key, otpEntry);
    await doc.save();
  }
}

async function deleteOTPByKey(email, sessionKey) {
  const doc = await AppState.findById('singleton');
  if (!doc) throw new Error('AppState not initialized');
  const normalizedEmail = email.toString().split(".").join("");
  const key = `${normalizedEmail}::${sessionKey}`;
  doc.otpManager.delete(key);
  await doc.save();
}

module.exports = {
  updateLiveUser,
  getLiveUsers,
  setLiveUsers,
  updateOTP, // Legacy - for security pin
  getOTP, // Legacy - for security pin
  saveOTP, // New - for auth flows
  getOTPByKey, // New - for auth flows
  verifyOTPByKey, // New - for auth flows
  deleteOTPByKey, // New - for auth flows
};
