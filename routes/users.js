const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

/*
=====================================
POST /users/create
- Secret key based user creation
- Password hashed
- Duplicate user check
=====================================
*/
router.post("/create", async (req, res) => {
  try {
    if (req.query.secretkey !== "krishnavtarsaini0011") {
      return res.status(403).json({ message: "Invalid secret key" });
    }

    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      isAdmin: isAdmin // optional
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
=====================================
POST /users/create-by-admin
- JWT protected
- Only ADMIN can create users
- isAdmin ALWAYS false
=====================================
*/
router.post("/create-by-admin", auth, async (req, res) => {
  try {
    // Check requesting user
    const adminUser = await User.findById(req.user.id);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to create users. Sorry!"
      });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      isAdmin: false
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        username: newUser.username,
        isAdmin: newUser.isAdmin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

