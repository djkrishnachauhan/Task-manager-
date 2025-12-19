const mongoose = require("../db");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dueDateTime: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    lastUpdatedTime: { type: Date, default: Date.now }
});

TaskSchema.pre("save", function (next) {
    this.lastUpdatedTime = new Date();
    next();
});

module.exports = mongoose.model("Task", TaskSchema);
