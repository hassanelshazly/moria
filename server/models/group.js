const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const GroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    Description: {
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
            user: {
                type: ObjectId,
                ref: "User"
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
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