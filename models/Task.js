const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
    dateTime: { type: Date, default: Date.now },
    alteredBy: String,
    field: String
}, { _id: false });

module.exports = mongoose.model("Task", new mongoose.Schema({
    title: String,
    description: String,
    dueDateTime: Date,
    isCompleted: Boolean,

    createdBy: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,

    logs: [LogSchema]
}));
