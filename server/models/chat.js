const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const GroupChatSchema = new mongoose.Schema({
    admin: {
        type: ObjectId,
        required: true,
        ref: "User",
    },
    members: [
        {
            type: ObjectId,
            required: true,
            ref: "User",
        },
    ]
}, { timestamps: true });

GroupChatSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'to'
});

module.exports = GroupChatSchema;
