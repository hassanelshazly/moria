const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const PageSchema = new mongoose.Schema({
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
    owner: {
        type: ObjectId,
        ref: 'User'
    },
    followers: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: ObjectId,
            ref: 'Post'
        }
    ]

}, { timestamps: true });

module.exports = PageSchema;