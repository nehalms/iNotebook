const AuthOTP = require('../models/AuthOTP');
const NormalOTP = require('../models/NormalOTP');
const LiveUser = require('../models/LiveUser');

// ==================== Live User Functions ====================
async function updateLiveUser(userId, deviceId, { name, ip }) {
  const key = `${userId}::${deviceId}`;
  await LiveUser.findOneAndUpdate(
    { userId, deviceId },
    { 
      name, 
      ip, 
      lastActivity: new Date(),
      createdAt: new Date(), // Reset TTL on update
    },
    { upsert: true, new: true },
  );
}

async function getLiveUsers() {
  const users = await LiveUser.find({}).lean();
  const usersMap = {};
  users.forEach(user => {
    const key = `${user.userId}::${user.deviceId}`;
    usersMap[key] = {
      name: user.name,
      ip: user.ip,
      date: user.lastActivity,
    };
  });
  return usersMap;
}

// ==================== Normal OTP Functions (Security Pin, etc.) ====================
// Legacy functions - for backward compatibility with security pin and EmailController
async function updateOTP(email, { code, expiryTime }) {
  const normalizedEmail = email.toString().split(".").join("");
  
  const existingOTP = await NormalOTP.findOne({ email: normalizedEmail });
  
  if (existingOTP) {
    // Update existing OTP, keep original createdAt for TTL
    await NormalOTP.findOneAndUpdate(
      { email: normalizedEmail },
      {
        code,
        expiryTime: new Date(expiryTime),
        isVerified: false,
        type: 'security-pin',
      },
      { new: true }
    );
  } else {
    // Create new OTP with new createdAt for TTL
    await NormalOTP.create({
      email: normalizedEmail,
      code,
      expiryTime: new Date(expiryTime),
      isVerified: false,
      type: 'security-pin',
      createdAt: new Date(),
    });
  }
}

async function getOTP(email) {
  const normalizedEmail = email.toString().split(".").join("");
  const otp = await NormalOTP.findOne({ email: normalizedEmail }).lean();
  
  if (!otp) return null;
  
  return {
    code: otp.code,
    expiryTime: otp.expiryTime,
    isVerified: otp.isVerified,
    type: otp.type,
    createdAt: otp.createdAt,
  };
}

// ==================== Auth OTP Functions (Login, Signup, Forgot Password) ====================
async function saveOTP(email, sessionKey, { code, expiryTime, type }) {
  const normalizedEmail = email.toString().split(".").join("");
  
  const existingOTP = await AuthOTP.findOne({ email: normalizedEmail, sessionKey });
  
  if (existingOTP) {
    // Update existing OTP, keep original createdAt for TTL
    await AuthOTP.findOneAndUpdate(
      { email: normalizedEmail, sessionKey },
      {
        code,
        expiryTime: new Date(expiryTime),
        isVerified: false,
        type: type || 'login',
      },
      { new: true }
    );
  } else {
    // Create new OTP with new createdAt for TTL
    await AuthOTP.create({
      email: normalizedEmail,
      sessionKey,
      code,
      expiryTime: new Date(expiryTime),
      isVerified: false,
      type: type || 'login',
      createdAt: new Date(),
    });
  }
}

async function getOTPByKey(email, sessionKey) {
  const normalizedEmail = email.toString().split(".").join("");
  const otp = await AuthOTP.findOne({ 
    email: normalizedEmail, 
    sessionKey 
  }).lean();
  
  if (!otp) return null;
  
  return {
    email: otp.email,
    sessionKey: otp.sessionKey,
    code: otp.code,
    expiryTime: otp.expiryTime,
    isVerified: otp.isVerified,
    type: otp.type,
    createdAt: otp.createdAt,
  };
}

async function verifyOTPByKey(email, sessionKey) {
  const normalizedEmail = email.toString().split(".").join("");
  
  await AuthOTP.findOneAndUpdate(
    { email: normalizedEmail, sessionKey },
    { isVerified: true },
    { new: true }
  );
}

module.exports = {
  // Live User functions
  updateLiveUser,
  getLiveUsers,
  
  // Normal OTP functions (legacy - for security pin)
  updateOTP,
  getOTP,
  
  // Auth OTP functions (new - for login, signup, forgot-password)
  saveOTP,
  getOTPByKey,
  verifyOTPByKey,
};
