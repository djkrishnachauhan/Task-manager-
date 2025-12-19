const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/login", async (req, res) => {
    const user = await User.findOne(req.body);
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
        { id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        token,
        username: user.username,
        isAdmin: user.isAdmin
    });
});

module.exports = router;
