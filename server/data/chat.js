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
    await message.populate('to')
        .populate('from')
        .execPopulate();

    await pubSub.publish(NEW_MESSAGE, { newMessage: message });
    return message;
}

GroupChatModel.statics.findGroupChats = async function (args) {
    let { userId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    await user.populate({
        path: 'groupChats',
        populate: [
            { path: 'admin' },
            { path: 'members' },
            {
                path: 'messages',
                populate: [
                    { path: 'to' },
                    { path: 'from' },
                ]

            }
        ]
    }).execPopulate();

    return user.groupChats;
}

GroupChatModel.statics.createGroupChat = async function (args) {
    let { userId, membersId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const members = membersId.map(async memberId => {
        const member = await User.findById(memberId);
        if (!member)
            throw new Error("Member not found");
        return member;
    });

    const groupChat = new GroupChat({
        admin: userId,
        members: membersId
    })
    await groupChat.save();

    user.groupChats.push(groupChat._id);
    await user.save();

    members.forEach(async member => {
        member = await member;
        member.groupChats.push(groupChat._id);
        await member.save();
    });

    await groupChat.populate('admin')
        .populate('members')
        .execPopulate();

    return groupChat;
}

const GroupChat = mongoose.model("GroupChat", GroupChatModel);
module.exports = GroupChat;

