const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // i will read more about virtual field to store password and change it
    password: {
        type: String,
        required: true
    },
    isOnline:
    {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    bio: {
        type: String,
        default: "I love Moria"
    },
    following: [{ type: ObjectId, ref: "User" }], // following list
    followers: [{ type: ObjectId, ref: "User" }], // followers list

});


module.exports = mongoose.model("User", userSchema);
