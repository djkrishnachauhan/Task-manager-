const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

/* GET TASKS */
router.get("/", auth, async (req, res) => {
    let filter = { user: req.user.id, isDeleted: false };

    if (req.user.isAdmin && req.query.deleted === "true") {
        filter = { user: req.user.id, isDeleted: true };
    }

    const tasks = await Task.find(filter).sort({ dueDateTime: 1 });
    res.json(tasks);
});

/* CREATE TASK */
router.post("/", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user.id,
        createdBy: req.user.username,
        logs: [{ alteredBy: req.user.username, field: "Task Created" }]
    });

    await task.save();
    res.json(task);
});

/* UPDATE TASK */
router.put("/:id", auth, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.sendStatus(404);

    Object.keys(req.body).forEach(field => {
        if (task[field] != req.body[field]) {
            task.logs.push({
                alteredBy: req.user.username,
                field
            });
            task[field] = req.body[field];
        }
    });

    await task.save();
    res.json(task);
});

/* SOFT DELETE */
router.delete("/:id", auth, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.sendStatus(404);

    task.isDeleted = true;
    task.deletedAt = new Date();
    task.logs.push({
        alteredBy: req.user.username,
        field: "Task Soft Deleted"
    });

    await task.save();
    res.json({ msg: "Task deleted" });
});

/* RESTORE TASK (ADMIN ONLY) */
router.put("/restore/:id", auth, async (req, res) => {
    if (!req.user.isAdmin)
        return res.status(403).json({ msg: "Admin only" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.sendStatus(404);

    task.isDeleted = false;
    task.deletedAt = null;
    task.logs.push({
        alteredBy: req.user.username,
        field: "Task Restored"
    });

    await task.save();
    res.json(task);
});

module.exports = router;
