const express = require("express");
const router = express.Router();
const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory")
const { body, validationResult } = require("express-validator"); //to validate the inputs
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const decrypt = require("../middleware/decrypt");
const UserHistory = require("../models/UserHistory");
const GameDetails = require("../models/GameDetails");
const SecurityPin = require("../models/SecurityPin");
const Keys = require("../models/Keys");
const { Email } = require("../Services/Email");
const { getAdminNotifyhtml, getAdminhtml, getSignUphtml, getForgotPasshtml } = require("../Services/getEmailHtml");
const { getOTPByKey, deleteOTPByKey } = require("../store/dataStore");
const crypto = require("crypto");
const axios = require("axios");
const JWT_SCERET = process.env.JWT_SCERET;
const SESSION_EXPIRY_TIME = parseInt(process.env.SESSION_EXPIRY_TIME);

// Helper function to extract session ID from cookies
function getSessionIdFromCookie(req) {
  return req.cookies?.otpSessionId || null;
}
//Route-1 : Create user using : POST "/api/auth/CreateUser => no login required

router.post("/createuser", decrypt,
  [
    body("name", "Enter a valid Name").isLength({ min: 5 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
    //if there are errors return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      const sessionKey = getSessionIdFromCookie(req);

      // If no session key, send OTP
      if (!sessionKey) {
        // Check if user already exists
        let existingUser = await User.findOne({ email: email, isActive: true});
        if (existingUser) {
          return res.status(400).json({ 
            success: false, 
            error: "A user with this email already exists" 
          });
        }

        // Generate session key and OTP
        const newSessionKey = crypto.randomBytes(16).toString('hex');
        const otpCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const salt = await bcrpyt.genSalt(10);
        const hashedCode = await bcrpyt.hash(otpCode.toString(), salt);
        const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Save OTP with email + sessionKey as key
        const { saveOTP } = require("../store/dataStore");
        await saveOTP(email, newSessionKey, {
          code: hashedCode,
          expiryTime: expiryTime,
          type: 'signup'
        });

        // Set session key in cookie
        res.cookie('otpSessionId', newSessionKey, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Send OTP email
        const html = getSignUphtml(otpCode);
        await Email(
          email,
          [],
          'Signup Verification OTP',
          '',
          html,
          false,
        );

        return res.status(400).json({ 
          success: false, 
          requiresOTP: true,
          error: "OTP has been sent to your email. Please verify OTP first.",
          message: "OTP has been sent to your email"
        });
      }

      // Session key exists, check if OTP is verified
      const otpEntry = await getOTPByKey(email, sessionKey);
      
      if (!otpEntry || otpEntry.type !== 'signup') {
        return res.status(400).json({ 
          success: false, 
          requiresOTP: true,
          error: "Invalid OTP session. Please request OTP again." 
        });
      }

      if (!otpEntry.isVerified) {
        return res.status(400).json({ 
          success: false, 
          requiresOTP: true,
          error: "OTP not verified. Please verify OTP first." 
        });
      }

      // OTP verified, proceed with signup
      // Check if user already exists (double check)
      let user = await User.findOne({ email: email, isActive: true});
      if (user) {
        return res.status(400).json({ success, error: "sorry a user with this mail already exist" });
      }

      //await helps to make processor to wait further processing next line till the current line is resolved and take data of this line n move
      // to use await the function must be async
      const salt = await bcrpyt.genSalt(10); //for generating salt
      secPass = await bcrpyt.hash(password, salt); // convert password to hash value
      //Create new user
      user = await User.create({
        // adds data to database
        name: name,
        email: email,
        password: secPass,
        permissions: ['notes', 'tasks', 'games', 'images', 'messages', 'news', 'calendar']
      });

      await UserHistory.create({
        userId: user.id,
        action: "Account Created",
      });

      const data = {
        user: {
          id: user.id,
          permissions: user.permissions,
        },
      };

      const authToken = jwt.sign(data, JWT_SCERET, {expiresIn: SESSION_EXPIRY_TIME * 60 * 60 });
      success = true;
      res.cookie('authToken', authToken, {
        httpOnly: true,   
        secure: true,           
        sameSite: 'none',
        maxAge: (SESSION_EXPIRY_TIME * 2) * 60 * 60 * 1000,          
      });

      // Clear OTP session cookie and delete OTP entry
      res.clearCookie('otpSessionId', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      await deleteOTPByKey(email, sessionKey);
      
      let html = getAdminNotifyhtml(user.name, user.email);
      Email(
        process.env.ADMIN_EMAIL,
        [],
        'New User Notification',
        '',
        html,
        false,
      )
      res.json({success, permissions: user.permissions, isPinSet: false});
    } 
    catch (err) {
      console.log("Error in creating user", err.message);
      return res.status(500).send("Internal Server Error!!");
    }
  }
);



//Route-2 : Authenticating the user : POST "/api/auth/login => login required
router.post(
  "/login", decrypt,
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

      const { email, password } = req.body;
      const sessionKey = getSessionIdFromCookie(req);
    try {
      // Select only needed fields for login (including name and email for LoginHistory)
      let user = await User.findOne({ email: email, isActive: true }).select('_id password permissions isAdmin name email');
      if (!user) {
        success = false;
        return res.status(400).json({success, error: "Sorry no user found with this email" });
      }

      const passwordCompare = bcrpyt.compareSync(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, error: "Please try to login with correct credentials: Incorrect password" });
      }

      // If user is NOT admin, set cookie and send response
      if (!user.isAdmin) {
        const payload = {
          user: {
            id: user.id,
            permissions: user.permissions,
          },
        };
        const authToken = jwt.sign(payload, JWT_SCERET, {expiresIn: SESSION_EXPIRY_TIME * 60 * 60 });
        success = true;

        const securityPin = await SecurityPin.findOne({user: user.id}).select('_id isPinVerified').lean();
        const isPinSet = securityPin ? true : false;
        
        // Reset pin verification status on login
        if (isPinSet) {
          await SecurityPin.findOneAndUpdate(
            { user: user.id },
            { isPinVerified: false },
            { new: true }
          );
        }

        res.cookie('authToken', authToken, {
          httpOnly: true,   
          secure: true,           
          sameSite: 'none',
          maxAge: (SESSION_EXPIRY_TIME * 2) * 60 * 60 * 1000,          
        });

        // Parallelize history and user update operations
        await Promise.all([
          LoginHistory.create({
            userId: user.id,
            name: user.name,
            email: user.email,
          }),
          UserHistory.create({
            userId: user.id,
            action: "Logged In",
          }),
          User.findByIdAndUpdate(user.id, {lastLogIn: new Date()}, {new: true})
        ]);

        return res.json({ success, isAdminUser: user.isAdmin, permissions: user.permissions, isPinSet});
      }

      // If user is admin, check OTP session
      if (user.isAdmin) {
        // If no session key, send OTP
        if (!sessionKey) {
          // Generate session key and OTP
          const newSessionKey = crypto.randomBytes(16).toString('hex');
          const otpCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
          const salt = await bcrpyt.genSalt(10);
          const hashedCode = await bcrpyt.hash(otpCode.toString(), salt);
          const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

          // Save OTP with email + sessionKey as key
          const { saveOTP } = require("../store/dataStore");
          await saveOTP(email, newSessionKey, {
            code: hashedCode,
            expiryTime: expiryTime,
            type: 'login'
          });

          // Set session key in cookie
          res.cookie('otpSessionId', newSessionKey, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000, // 15 minutes
          });

          // Send OTP email
          const html = getAdminhtml(otpCode);
          await Email(
            email,
            [],
            'Admin Login OTP',
            '',
            html,
            false,
          );

          return res.status(400).json({ 
            success: false, 
            isAdminUser: true, 
            requiresOTP: true,
            error: "OTP has been sent to your email. Please verify OTP first.",
            message: "OTP has been sent to your email"
          });
        }

        // Session key exists, check if OTP is verified
        const otpEntry = await getOTPByKey(email, sessionKey);
        
        if (!otpEntry || otpEntry.type !== 'login') {
          return res.status(400).json({ 
            success: false, 
            isAdminUser: true,
            requiresOTP: true,
            error: "Invalid OTP session. Please request OTP again." 
          });
        }

        if (!otpEntry.isVerified) {
          return res.status(400).json({ 
            success: false, 
            isAdminUser: true,
            requiresOTP: true,
            error: "OTP not verified. Please verify OTP first." 
          });
        }

        // OTP verified, proceed with login
        const payload = {
          user: {
            id: user.id,
            permissions: user.permissions,
          },
        };
        const authToken = jwt.sign(payload, JWT_SCERET, {expiresIn: SESSION_EXPIRY_TIME * 60 * 60 });
        success = true;

        const securityPin = await SecurityPin.findOne({user: user.id}).select('_id isPinVerified').lean();
        const isPinSet = securityPin ? true : false;
        
        // Reset pin verification status on login
        if (isPinSet) {
          await SecurityPin.findOneAndUpdate(
            { user: user.id },
            { isPinVerified: false },
            { new: true }
          );
        }

        res.cookie('authToken', authToken, {
          httpOnly: true,   
          secure: true,           
          sameSite: 'none',
          maxAge: (SESSION_EXPIRY_TIME * 2) * 60 * 60 * 1000,          
        });

        // Clear OTP session cookie and delete OTP entry
        res.clearCookie('otpSessionId', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        await deleteOTPByKey(email, sessionKey);

        // Parallelize history and user update operations
        await Promise.all([
          LoginHistory.create({
            userId: user.id,
            name: user.name,
            email: user.email,
          }),
          UserHistory.create({
            userId: user.id,
            action: "Logged In",
          }),
          User.findByIdAndUpdate(user.id, {lastLogIn: new Date()}, {new: true})
        ]);

        return res.json({ success, isAdminUser: user.isAdmin, permissions: user.permissions, isPinSet});
      }
    } 
    catch (err) {
      console.log("Error in logging in", err.message);
      return res.status(500).send("Internal Server Error!!");
    }
  }
);



//Route-3 : get loggedIn user details : POST "/api/auth/getuser" => Login required
router.post("/getuser", fetchuser,  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send({status: 1, user: user});
  } 
  catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
});

router.post("/getPassword", decrypt,
  [
    body("email", "Enter valid email").isEmail()
  ],
  async (req, res) => {
    try{
      let found = true;
      const email = req.body.email;
      const user = await User.findOne({email: email}).select("-password");
      if (!user) {
        found = false;
        return res.status(400).json({found, error: "No user found with the given mail" });
      }
      res.json({found, user})
    }
    catch(err){
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  }
);

router.post("/updatePassword", decrypt,
  [
    body("id", "Enter a valid id"),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id, email, password } = req.body;
      const sessionKey = getSessionIdFromCookie(req);

      // If no session key, send OTP (password not required at this stage)
      if (!sessionKey) {
        // Verify user exists
        const user = await User.findOne({ email: email, isActive: true }).select('_id').lean();
        if (!user) {
          return res.status(400).json({ 
            success: false, 
            error: "No user found with this email" 
          });
        }

        // Generate session key and OTP
        const newSessionKey = crypto.randomBytes(16).toString('hex');
        const otpCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const salt = await bcrpyt.genSalt(10);
        const hashedCode = await bcrpyt.hash(otpCode.toString(), salt);
        const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Save OTP with email + sessionKey as key
        const { saveOTP } = require("../store/dataStore");
        await saveOTP(email, newSessionKey, {
          code: hashedCode,
          expiryTime: expiryTime,
          type: 'forgot-password'
        });

        // Set session key in cookie
        res.cookie('otpSessionId', newSessionKey, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Send OTP email
        const html = getForgotPasshtml(otpCode);
        await Email(
          email,
          [],
          'Reset Password OTP',
          '',
          html,
          false,
        );

        return res.status(400).json({ 
          success: false, 
          requiresOTP: true,
          error: "OTP has been sent to your email. Please verify OTP first.",
          message: "OTP has been sent to your email"
        });
      }

      // Session key exists, check if OTP is verified
      const otpEntry = await getOTPByKey(email, sessionKey);
      
      if (!otpEntry || otpEntry.type !== 'forgot-password') {
        return res.status(400).json({ 
          success: false, 
          requiresOTP: true,
          error: "Invalid OTP session. Please request OTP again." 
        });
      }

      if (!otpEntry.isVerified) {
        return res.status(400).json({ 
          success: false, 
          requiresOTP: true,
          error: "OTP not verified. Please verify OTP first." 
        });
      }

      // OTP verified, validate password is provided
      if (!password || password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          error: "Password must be at least 6 characters" 
        });
      }

      // OTP verified, proceed with password update
      const salt = await bcrpyt.genSalt(10); //for generating salt
      secPass = await bcrpyt.hash(password, salt);

      const newUser = {};
      newUser.password = secPass;
      let user = await User.findByIdAndUpdate(id, {$set: newUser}, {new: true})
      await UserHistory.create({
        userId: user.id,
        action: "Password updated",
      });

      // Clear OTP session cookie and delete OTP entry
      res.clearCookie('otpSessionId', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      await deleteOTPByKey(email, sessionKey);

      let success = true;
      res.json({success, user});
    }
    catch(err){
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  }
);

router.post('/updateName', fetchuser, decrypt, async (req, res) => {
  try {
    const [user, userStats] = await Promise.all([
      User.findByIdAndUpdate(
        req.user.id,
        { name: req.body.name },
        { new: true }
      ),
      GameDetails.findOneAndUpdate(
        { userId: req.user.id },
        { userName: req.body.name },
        { new: true }
      ),
      UserHistory.create({
        userId: req.user.id,
        action: "Username updated",
      })
    ]);
    res.send({success: true, user: user, stats: userStats});
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
});

// Change password for authenticated users (from profile page)
router.post('/changePassword', fetchuser, decrypt, async (req, res) => {
  try {
    const { password } = req.body;

    // Validate password
    if (!password) {
      return res.status(400).json({ 
        success: false, 
        error: "Password is required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: "Password must be at least 6 characters" 
      });
    }

    // Hash the new password
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(password, salt);

    // Update user password
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true }
    ).select('-password');

    // Create history entry
    await UserHistory.create({
      userId: req.user.id,
      action: "Password changed from profile",
    });

    res.json({ 
      success: true, 
      message: "Password updated successfully", 
    });
  } catch (err) {
    console.log("Error in changePassword:", err.message);
    return res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
});

router.post("/changestatus", fetchuser,  async (req, res) => {
  try {
    // Get email first, then parallelize update and history
    const userEmail = await User.findById(req.user.id).select('email').lean();
    let email = `${userEmail.email}__${req.user.id}`;
    await Promise.all([
      User.findByIdAndUpdate(req.user.id, {isActive: false, email : email}, {new: true}),
      UserHistory.create({
        userId: req.user.id,
        action: "Account deleted",
      })
    ]);
    res.send({
      message: "Account deleted successfully",
    });
  } 
  catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
});

router.get('/getstate', fetchuser, async (req, res) => {
  try {
    const [user, securityPin] = await Promise.all([
      User.findById(req.user.id).select("-password").lean(),
      SecurityPin.findOne({ user: req.user.id }).select('isPinVerified').lean()
    ]);
    const isPinSet = securityPin ? true : false;
    const isPinVerified = securityPin?.isPinVerified || false;
    res.send({
      status: 1,
      data: {
        email: user.email,
        isAdminUser: user.isAdmin,
        permissions: user.permissions,
        isPinSet: isPinSet,
        isPinVerified: isPinVerified,
      }
    });
  }  catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
})

router.post('/logout', fetchuser, async (req, res) => {
  try {
    await UserHistory.create({
      userId: req.user.id,
      action: "Logged out",
    });
    
    // Reset pin verification status on logout
    await SecurityPin.findOneAndUpdate(
      { user: req.user.id },
      { isPinVerified: false },
      { new: true }
    );
    
    res.clearCookie("authToken", {
      path: "/",     
      httpOnly: true, 
      secure: true, 
      sameSite: "none",
    });
    res.send({success: true, msg: 'Logged out'});
  }  catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
});

router.post('/checkuserandsendotp', decrypt, async (req, res) => {
    try {
        const { email } = req.body;
        const type = req.query.type || req.body.type || 'signup';
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: "Email is required" 
            });
        }

        // Check if user with this email exists - use lean() for read-only check
        let user = await User.findOne({ email: email, isActive: true }).select('_id').lean();
        
        // Different logic based on type
        if (type === 'signup') {
            // For signup: user should NOT exist
            if (user) {
                return res.status(400).json({ 
                    success: false, 
                    error: "A user with this email already exists" 
                });
            }
        } else if (type === 'forgot-password') {
            // For forgot password: user MUST exist
            if (!user) {
                return res.status(400).json({ 
                    success: false, 
                    error: "No user found with this email" 
                });
            }
        } else {
            return res.status(400).json({ 
                success: false, 
                error: "Invalid type. Must be 'signup' or 'forgot-password'" 
            });
        }

        // User check passed, send OTP
        try {
            const { Email } = require("../Services/Email");
            const { getForgotPasshtml, getSignUphtml } = require("../Services/getEmailHtml");
            const { updateOTP } = require("../store/dataStore");
            
            var val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            let html, subject;
            
            if (type === 'forgot-password') {
                html = getForgotPasshtml(val);
                subject = 'Reset Password';
            } else {
                html = getSignUphtml(val);
                subject = 'Create Account';
            }
            
            const salt = await bcrpyt.genSalt(10);
            const hashedVal = await bcrpyt.hash(val.toString(), salt);
            
            await updateOTP(email, {
                code: hashedVal,
                expiryTime: (Date.now() + 10 * 60 * 1000),
            });
            
            // Send email and wait for it to complete (blocking)
            try {
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
                    message: "OTP has been sent to your email",
                    user: type === 'forgot-password' ? { _id: user._id } : undefined
                });
            } catch (emailError) {
                console.log("Error sending OTP email:", emailError);
                return res.status(500).json({ 
                    success: false, 
                    error: "Failed to send OTP email" 
                });
            }
        } catch (error) {
            console.log("Error in OTP generation/storage:", error);
            return res.status(500).json({ 
                success: false, 
                error: "Failed to generate OTP" 
            });
        }
    } catch (err) {
        console.log("Error in checkuserandsendotp:", err.message);
        return res.status(500).json({ 
            success: false, 
            error: "Internal Server Error" 
        });
    }
});

// Send admin OTP for login
router.post('/sendadminotp', decrypt, async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: "Email is required" 
            });
        }

        // Check if user exists and is admin
        let user = await User.findOne({ email: email, isActive: true }).select('_id isAdmin').lean();
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                error: "No user found with this email" 
            });
        }
        
        if (!user.isAdmin) {
            return res.status(400).json({ 
                success: false, 
                error: "User is not an admin" 
            });
        }

        // Generate OTP and send email
        try {
            const { Email } = require("../Services/Email");
            const { getAdminhtml } = require("../Services/getEmailHtml");
            const { updateOTP } = require("../store/dataStore");
            
            var val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const html = getAdminhtml(val);
            
            const salt = await bcrpyt.genSalt(10);
            const hashedVal = await bcrpyt.hash(val.toString(), salt);
            
            // Store OTP with user's email instead of ADMIN_EMAIL
            await updateOTP(email, {
                code: hashedVal,
                expiryTime: (Date.now() + 10 * 60 * 1000),
            });
            
            // Send email to user's email instead of ADMIN_EMAIL
            await Email(
                email,
                [],
                'Admin Login',
                '',
                html,
                false, // toAdmin = false, send to user's email
            );
            
            res.json({ 
                success: true, 
                message: "Admin OTP has been sent to your email"
            });
        } catch (error) {
            console.log("Error in admin OTP generation/sending:", error);
            return res.status(500).json({ 
                success: false, 
                error: "Failed to send admin OTP" 
            });
        }
    } catch (err) {
        console.log("Error in sendadminotp:", err.message);
        return res.status(500).json({ 
            success: false, 
            error: "Internal Server Error" 
        });
    }
});

router.get('/getpubKey', async (req, res) => {
  try {
    // Use lean() and select only needed field
    let key = await Keys.findOne().select('publicKey').lean();
    if (!key) {
      return res.status(404).send({success: false, error: "Public key not found"});
    }
    res.send({success: true, key: key.publicKey});
  }  catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
});


module.exports = router;























// .then(user => res.json(user))                // returns data to the user.
// .catch(err => {console.log(err)
// res.json({error: "Please enter unique value for email",
//           message: err.message})});           // to catch the error and log to console
