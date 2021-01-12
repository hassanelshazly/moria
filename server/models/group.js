const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const GroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    coverUrl: {
        type: String,
    },
    profileUrl: {
        type: String,
    },
    description: {
        type: String
    },
    admin: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    requests: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    posts: [
        {
            type: ObjectId,
            ref: 'Post'
        }
    ],

}, { timestamps: true });

module.exports = GroupSchema;