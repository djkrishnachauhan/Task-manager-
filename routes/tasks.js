const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

function mapTask(task) {
    return {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        dueDateTime: task.dueDateTime,
        isCompleted: task.isCompleted,
        lastUpdatedTime: task.lastUpdatedTime
    };
}

router.get("/", async (req, res) => {
    const tasks = await Task.find().sort({ dueDateTime: 1 });
    res.json(tasks.map(mapTask));
});

router.get("/updates", async (req, res) => {
    const since = new Date(req.query.since);
    const tasks = await Task.find({ lastUpdatedTime: { $gt: since } });
    res.json(tasks.map(mapTask));
});

router.post("/", async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(mapTask(task));
});

router.put("/:id", async (req, res) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        { ...req.body, lastUpdatedTime: new Date() },
        { new: true }
    );
    res.json(mapTask(task));
});

router.delete("/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;
