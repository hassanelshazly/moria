const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const PostSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    group: {
        type: ObjectId,
        ref: 'Group'
    },
    imageUrl: {
        type: String,
    },
    imageId: {
        type: String,
    },
    page: {
        type: ObjectId,
        ref: 'Page'
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
            user: {
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
}, { timestamps: true });

module.exports = PostSchema;
