const router = require("express").Router();
const User = require("../models/User");

router.post("/create", async (req, res) => {
    if (req.query.secretkey !== "krishnavtarsaini0011")
        return res.sendStatus(403);

    const user = await User.create(req.body);
    res.json(user);
});

module.exports = router;
