const express = require("express");
const router = express.Router();
const bcrpyt = require("bcryptjs");
const decrypt = require("../middleware/decrypt");
const crypto = require("crypto");
const { saveOTP, getOTPByKey, verifyOTPByKey, deleteOTPByKey } = require("../store/dataStore");
const { Email } = require("../Services/Email");
const { getAdminhtml, getForgotPasshtml, getSignUphtml } = require("../Services/getEmailHtml");
const User = require("../models/User");

// Helper function to extract session ID from cookies
function getSessionIdFromCookie(req) {
  return req.cookies?.otpSessionId || null;
}

// Send OTP for login, signup, or forgot-password
// Type is passed as path parameter since body is encrypted
router.post('/sendotp/:type', decrypt, async (req, res) => {
  try {
    const { email } = req.body;
    const type = req.params.type;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email is required" 
      });
    }

    if (!type || !['login', 'signup', 'forgot-password'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid type is required (login, signup, or forgot-password). Use path: /sendotp/login, /sendotp/signup, or /sendotp/forgot-password" 
      });
    }

    // Validate user existence based on type
    if (type === 'login' || type === 'forgot-password') {
      const user = await User.findOne({ email: email, isActive: true }).select('_id isAdmin').lean();
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          error: "No user found with this email" 
        });
      }
      
      // For login, check if admin
      if (type === 'login' && !user.isAdmin) {
        return res.status(400).json({ 
          success: false, 
          error: "OTP is only required for admin users" 
        });
      }
    } else if (type === 'signup') {
      const user = await User.findOne({ email: email, isActive: true }).select('_id').lean();
      if (user) {
        return res.status(400).json({ 
          success: false, 
          error: "A user with this email already exists" 
        });
      }
    }

    // Generate session key and OTP
    const sessionKey = crypto.randomBytes(16).toString('hex');
    const otpCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const salt = await bcrpyt.genSalt(10);
    const hashedCode = await bcrpyt.hash(otpCode.toString(), salt);
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP with email + sessionKey as key
    await saveOTP(email, sessionKey, {
      code: hashedCode,
      expiryTime: expiryTime,
      type: type
    });

    // Set session key in cookie
    res.cookie('otpSessionId', sessionKey, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Prepare email content based on type
    let html, subject;
    if (type === 'login') {
      html = getAdminhtml(otpCode);
      subject = 'Admin Login OTP';
    } else if (type === 'forgot-password') {
      html = getForgotPasshtml(otpCode);
      subject = 'Reset Password OTP';
    } else {
      html = getSignUphtml(otpCode);
      subject = 'Signup Verification OTP';
    }

    // Send email
    await Email(
      email,
      [],
      subject,
      '',
      html,
      false,
    );

    res.json({ 
      success: true, 
      message: `OTP has been sent to your email` 
    });
  } catch (err) {
    console.log("Error in sendotp:", err.message);
    return res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
});

// Verify OTP
router.post('/verifyotp', decrypt, async (req, res) => {
  try {
    const { email, code } = req.body;
    const sessionKey = getSessionIdFromCookie(req);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email is required" 
      });
    }

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: "OTP code is required" 
      });
    }

    if (!sessionKey) {
      return res.status(400).json({ 
        success: false, 
        error: "OTP session not found. Please request OTP again." 
      });
    }

    // Get OTP entry using email + sessionKey
    const otpEntry = await getOTPByKey(email, sessionKey);
    
    if (!otpEntry) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid OTP session. Please request OTP again." 
      });
    }

    // Check if already verified
    if (otpEntry.isVerified) {
      return res.status(400).json({ 
        success: false, 
        error: "OTP has already been verified" 
      });
    }

    // Check if expired
    if (Date.now() > new Date(otpEntry.expiryTime).getTime()) {
      await deleteOTPByKey(email, sessionKey);
      return res.status(400).json({ 
        success: false, 
        error: "OTP has expired. Please request a new one." 
      });
    }

    // Verify code
    const isValid = bcrpyt.compareSync(code.toString(), otpEntry.code);
    
    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid OTP code" 
      });
    }

    // Mark as verified
    await verifyOTPByKey(email, sessionKey);

    res.json({ 
      success: true, 
      verified: true,
      message: "OTP verified successfully",
      type: otpEntry.type
    });
  } catch (err) {
    console.log("Error in verifyotp:", err.message);
    return res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
});

module.exports = router;
