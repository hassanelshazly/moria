const mongoose = require("mongoose");

const GroupChatModel = require("../models/chat");
const User = require("./user");
const Message = require("./message");
const { pubSub, NEW_MESSAGE } = require("../util/subscription");

GroupChatModel.statics.sendGroupMessage = async function (args) {
    let { userId, groupChatId, body } = args;

    if (!userId)
        throw new Error("User not authorized");

    if (body.trim() === '')
        throw new Error("Cannot send an empty message");

    const group = await GroupChat.findById(groupChatId);
    if (!group)
        throw new Error("Group Chat not found");

    if (group.admin != userId &&
        !group.members.includes(userId))
        throw new Error("User is not member of the group");

    const message = new Message({
        from: userId,
        to: groupChatId,
        onModel: 'GroupChat',
        body
    });

    await message.save();
    await message.populate('to').populate('from').execPopulate();
    await pubSub.publish(NEW_MESSAGE, { newMessage: message });
    return message;
}

GroupChatModel.statics.findGroupChats = async function ({ userId }) {
    if (!userId)
        throw new Error("User not authorized");

    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");
    await user.populate('groupChats').execPopulate();
    return user.groupChats;
}

GroupChatModel.statics.findAdmin = async function ({ id }) {
    const chat = await GroupChat.findById(id);
    if (!chat)
        throw new Error("GroupChat not found");

    await chat.populate('admin').execPopulate();
    return chat.admin;
}

GroupChatModel.statics.findMembers = async function ({ id }) {
    const chat = await GroupChat.findById(id);
    if (!chat)
        throw new Error("GroupChat not found");

    await chat.populate('members').execPopulate();
    return chat.members;
}

GroupChatModel.statics.findMessages = async function ({ id }) {
    const chat = await GroupChat.findById(id);
    if (!chat)
        throw new Error("GroupChat not found");

    await chat.populate({
        path: 'messages',
        populate: [
            { path: 'to' },
            { path: 'from' }
        ]
    }).execPopulate();
    return chat.messages;
}


GroupChatModel.statics.createGroupChat = async function (args) {
    let { title, userId, membersId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const members = await Promise.all(
        membersId.map(async memberId => {
            const member = await User.findById(memberId);
            if (!member)
                throw new Error("Member not found");
            return member;
        })
    );

    const groupChat = new GroupChat({
        title,
        admin: userId,
        members: membersId
    })
    await groupChat.save();

    user.groupChats.push(groupChat._id);
    await user.save();

    for (member of members) {
        member.groupChats.push(groupChat._id);
        await member.save();
    }

    return groupChat;
}

const GroupChat = mongoose.model("GroupChat", GroupChatModel);
module.exports = GroupChat;

