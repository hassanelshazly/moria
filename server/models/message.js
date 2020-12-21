const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;


const MessageSchema = new mongoose.Schema({
    from: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    to: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    body: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = MessageSchema;