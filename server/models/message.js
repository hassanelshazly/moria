const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;


const MessageSchema = new mongoose.Schema({
    from: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    to: {
        type: ObjectId,
        required: true,
        refPath: "onModel"
    },
    body: {
        type: String,
        required: true,
    },
    onModel: {
        type: String,
        enum: [
            'User',
            'GroupChat'
        ],
        default: 'User'
    }

}, { timestamps: true });

module.exports = MessageSchema;