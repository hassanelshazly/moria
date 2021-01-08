const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

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
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        trim: true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationToken: {
        type: String,
        lowercase: true,
    },
    social: {
        googleId: String,
        facebookId: String
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
    ], 
    groupChats: [
        {
            type: ObjectId,
            ref: "GroupChat"
        }
    ],
}, { timestamps: true });

// Virtual fields
UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user'
});

UserSchema.virtual('notifications', {
    ref: 'Notification',
    localField: '_id',
    foreignField: 'user'
})

module.exports = UserSchema;