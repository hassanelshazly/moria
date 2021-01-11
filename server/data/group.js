const mongoose = require("mongoose");

const GroupModel = require("../models/group");

GroupModel.statics.findGroup = async function (args) {
    const group = await Group.findById(groupId);
    await group.populate('admin').execPopulate();
    return group;
}

GroupModel.statics.createGroup = async function (args) {
    const { userId } = args;
    if (!userId)
        throw new Error("User not authorized")

    const group = new Group({
        ...args,
        user: userId
    });
    await group.save();
    await group.populate('admin').execPopulate();
    return group
}

GroupModel.statics.deleteGroup = async function ({ groupId, userId }) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");
    
    if (!userId || userId != group.userId)
    throw new Error("User not authorized");

    await page.delete();
    return "Group deleted successfully!";
}

GroupModel.statics.createGroupPost = async function (args) {
    const { groupId, body, userId } = args;
    if (!userId)
        throw new Error("User not authorized")

    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    group.posts.push({ userId, body });
    await group.save();
    await group.populate('admin').execPopulate();
    return group;
}

GroupModel.statics.deleteGroupPost = async function (args) {
    const { groupId, postId, userId } = args;
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    const pIdx = group.posts.findIndex(post => post._id == postId);

    if (pIdx == -1 || group.posts[pIdx].userId != userId)
        throw new Error("User not authorized");

    group.posts.splice(pIdx, 1);
    await group.save();
    await group.populate('admin').execPopulate;
    return group
}


const Group = mongoose.model("Group", GroupModel);
module.exports = Group;
