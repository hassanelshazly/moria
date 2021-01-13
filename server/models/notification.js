const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const {
    FOLLOW,
    POST,
    LIKE,
    COMMENT,
    GROUP_ADD,
    GROUP_POST,
    GROUP_REQUEST,
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
            COMMENT,
            GROUP_ADD,
            GROUP_POST,
            GROUP_REQUEST,
        ],
        required: true,
    },
    contentId: {
        type: ObjectId,
        required: true,
    }

}, { timestamps: true });

module.exports = NotificationSchema;