const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        ref: 'User'
    },
    likes: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            body: {
                type: String,
                required: true
            },
            username: {
                type: ObjectId,
                required: true,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    shares: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = PostSchema;