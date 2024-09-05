const express = require("express");
const router = express.Router();
const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory")
const { body, validationResult } = require("express-validator"); //to validate the inputs
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const UserHistory = require("../models/UserHistory");

const JWT_SCERET = process.env.JWT_SCERET;

//Route-1 : Create user using : POST "/api/auth/CreateUser => no login required

router.post("/createuser",
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
      //check wheather the user with this email exists already
      let user = await User.findOne({ email: req.body.email, isActive: true});
      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry a user with this mail already exist" });
      }

      //await helps to make processor to wait further processing next line till the current line is resolved and take data of this line n move
      // to use await the function must be async
      const salt = await bcrpyt.genSalt(10); //for generating salt
      secPass = await bcrpyt.hash(req.body.password, salt); // convert password to hasj value
      //Create new user
      user = await User.create({
        // adds data to database
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      await UserHistory.create({
        userId: user.id,
        action: "Account Created",
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SCERET, {expiresIn: 24 * 60 * 60 });
      success = true;
      res.json({success, authToken });
    } 
    catch (err) {
      console.log(err.message);
      return res.status(500).send("Internal Server Error!!");
    }
  }
);



//Route-2 : Authenticating the user : POST "/api/auth/login => login required
router.post(
  "/login",
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
    try {
      let user = await User.findOne({ email: email, isActive: true });
      if (!user) {
        success = false;
        return res.status(400).json({success, error: "Sorry no user found with this email" });
      }

      const passwordCompare = await bcrpyt.compareSync(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, error: "Please try to login with correct credentials: Incorrect password" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payload, JWT_SCERET, {expiresIn: 24 * 60 * 60 });
      success = true;
      await LoginHistory.create({
        userId: user.id,
        name: user.name,
        email: user.email,
      });
      await UserHistory.create({
        userId: user.id,
        action: "Logged In",
      });
      await User.findByIdAndUpdate(user.id, {lastLogIn: new Date()}, {new: true})
      res.json({ success, authToken });
    } 
    catch (err) {
      console.log(err.message);
      return res.status(500).send("Internal Server Error!!");
    }
  }
);



//Route-3 : get loggedIn user details : POST "/api/auth/getuser" => Login required
router.post("/getuser", fetchuser,  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } 
  catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
});

router.post("/getPassword", 
  [
    body("email", "Enter valid email").isEmail()
  ],
  async (req, res) => {
    try{
      let found = true;
      const email = req.body.email;
      const user = await User.findOne({email: email});
      if (!user) {
        found = false;
        return res.status(400).json({found, error: "Please try to login with correct credentials" });
      }
      res.json({found, user})
    }
    catch(err){
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  }
);

router.post("/updatePassword",
  [
    body("id", "Enter a valid id"),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be 6 characters").isLength({min : 6})
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salt = await bcrpyt.genSalt(10); //for generating salt
      secPass = await bcrpyt.hash(req.body.password, salt);

      const newUser = {};
      newUser.password = secPass;
      let user = await User.findByIdAndUpdate(req.body.id, {$set: newUser}, {new: true})
      await UserHistory.create({
        userId: user.id,
        action: "Password updated",
      });
      let success = true;
      res.json({success, user});
    }
    catch(err){
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  }
);

router.post("/changestatus", fetchuser,  async (req, res) => {
  try {
    const userEmail = await User.findById(req.user.id);
    console.log(userEmail);
    let email = `${userEmail.email}__${req.user.id}`;
    const user = await User.findByIdAndUpdate(req.user.id, {isActive: false, email : email}, {new: true});
    await UserHistory.create({
      userId: user.id,
      action: "Account deleted",
    });
    console.log(user);
    res.send(user);
  } 
  catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error!!");
  }
});

router.post('/logout', fetchuser, async (req, res) => {
  try {
    await UserHistory.create({
      userId: req.user.id,
      action: "Logged out",
    });
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
