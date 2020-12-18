const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    following: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    followers: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    savedPosts: [
        {
            type: ObjectId,
            ref: "Post"
        }
    ]

}, { timestamps: true });

// Virtual fields
UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'userId'
})

module.exports =  UserSchema;