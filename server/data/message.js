const mongoose = require("mongoose");

const MessageModel = require("../models/message");
const User = require("./user");
const { pubSub, NEW_MESSAGE } = require("../util/subscription");

MessageModel.statics.sendMessage = async function (args) {
    let { userId, toUserId, body } = args;

    if (!userId)
        throw new Error("User not authorized");

    if (body.trim() === '')
        throw new Error("Cannot send an empty message");

    const toUser = await User.findById(toUserId);
    if (!toUser)
        throw new Error("User not found");

    const message = new Message({
        from: userId,
        to: toUserId,
        body
    });

    await message.save();
    await pubSub.publish(NEW_MESSAGE, { newMessage: message });
    return message;
}

MessageModel.statics.findMessages = async function (args) {
    let { userId, toUserId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const toUser = await User.findById(toUserId);
    if (!toUser)
        throw new Error("User not found");

    const messages = await Message.find()
        .or([
            { $and: [{ to: userId }, { from: toUserId }] },
            { $and: [{ to: toUserId }, { from: userId }] }
        ]).sort({ createdAt: 'ASC' });

    return messages;
}

MessageModel.statics.findTo = async function ({ id }) {
    const message = await Message.findById(id);
    if (!message)
        throw new Error("Message not found");

    await message.populate('to').execPopulate();
    return message.to;
}

MessageModel.statics.findFrom = async function ({ id }) {
    const message = await Message.findById(id);
    if (!message)
        throw new Error("Message not found");

    await message.populate('from').execPopulate();
    return message.from;
}

const Message = mongoose.model("Message", MessageModel);
module.exports = Message;

