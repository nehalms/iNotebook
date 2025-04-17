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


async function updateOTP(email, { code, expiryTime }) {
  const doc = await AppState.findById('singleton');
  if (!doc) throw new Error('AppState not initialized');
  doc.otpManager.set(email.toString().split(".").join("").toString(), { code, expiryTime });
  await doc.save();
}

async function getOTP(email) {
  const doc = await AppState.findById('singleton').lean();
  return doc.otpManager[email.toString().split(".").join("").toString()] || null;
}

module.exports = {
  updateLiveUser,
  getLiveUsers,
  setLiveUsers,
  updateOTP,
  getOTP,
};
