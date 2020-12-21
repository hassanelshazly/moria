const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const {
    FOLLOW,
    POST,
    LIKE,
    COMMENT
} = require("../util/constant");

const NotificationSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    author: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        enum: [
            FOLLOW,
            POST,
            LIKE,
            COMMENT
        ],
        required: true,
    },
    contentId: {
        type: ObjectId,
        required: true,
    }

}, { timestamps: true });

module.exports = NotificationSchema;