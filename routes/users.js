const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/create", async (req, res) => {
    if (req.query.secretkey !== "krishnavtarsaini0011")
        return res.sendStatus(403);
    
        // Hash password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    res.json(user);
});

// ==================== NEW ROUTE ====================
router.post("/create-by-admin", async (req, res) => {
  try {
    // Get current user from token
    const adminUser = await User.findById(req.userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "You are not allowed to create users. Sorry!" });
    }

    // Get username and password from request body
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with isAdmin = false
    const newUser = await User.create({
      username,
      password: hashedPassword,
      isAdmin: false
    });

    res.status(201).json({ message: "User created successfully", user: { username: newUser.username, isAdmin: newUser.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
