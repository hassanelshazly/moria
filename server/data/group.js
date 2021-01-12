const mongoose = require("mongoose");

const User = require("./user");
const Post = require("./post");
const GroupModel = require("../models/group");
const { uploadImage } = require("../util/image");

GroupModel.statics.findGroup = async function (args) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");
    return group;
}

GroupModel.statics.findAllGroups = async function (args) {
    return await Group.find({});
}

GroupModel.statics.findAdmin = async function ({ id }) {
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    await group.populate('admin').execPopulate();
    return group.admin;
}

GroupModel.statics.findMembers = async function ({ id, userId }) {
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    if (!group.members.includes(userId) && group.admin != userId)
        throw new Error("User not authorized");

    await group.populate('members').execPopulate();
    return group.members;
}

GroupModel.statics.findPosts = async function ({ id, userId }) {
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    if (!group.members.includes(userId) && group.admin != userId)
        throw new Error("User not authorized");

    await group.populate('posts').execPopulate();
    return group.posts;
}

GroupModel.statics.findRequests = async function ({ id, userId }) {
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    if (group.admin != userId)
        throw new Error("User not authorized");

    await group.populate('requests').execPopulate();
    return group.requests;
}

GroupModel.statics.createGroup = async function (args) {
    const { userId, title, membersId, coverSrc, profileSrc } = args;
    if (!userId)
        throw new Error("User not authorized")

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

    const group = new Group({
        title,
        admin: userId,
        members: membersId
    });

    if (coverSrc)
        group.coverUrl = await uploadImage(coverSrc);

    if (profileSrc)
        group.profileUrl = await uploadImage(profileSrc);

    await group.save();

    await user.addOrRemoveGroup(group._id); 
    for (member of members)
        await member.addOrRemoveGroup(group._id); 

    return group;
}

GroupModel.statics.changeGroupCover = async function (args) {
    let { coverSrc, userId, groupId } = args;
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    if (group.admin != userId)
        throw new Error("User not authoried");

    group.coverUrl = await uploadImage(coverSrc);
    return await group.save();
}

GroupModel.statics.changeGroupProfile = async function (args) {
    let { profileSrc, userId, groupId } = args;
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    if (group.admin != userId)
        throw new Error("User not authoried");

    group.profileUrl = await uploadImage(profileSrc);
    return await page.save();
}

GroupModel.statics.deleteGroup = async function ({ groupId, userId }) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    if (!userId || userId != group.admin)
        throw new Error("User not authorized");

    // TDOD
    // delete posts

    await group.delete();
    return "Group deleted successfully!";
}

GroupModel.statics.createGroupPost = async function (args) {
    const { groupId, userId } = args;
    if (!userId)
        throw new Error("User not authorized")

    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    if (!group.members.includes(userId) && group.admin != userId)
        throw new Error("User not authorized")

    const post = await Post.createPost(args);

    group.posts.push(post._id);
    await group.save();
    return post;
}

GroupModel.statics.deleteGroupPost = async function (args) {
    const { groupId, postId, userId } = args;
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    const pIdx = group.posts.findIndex(post => post._id == postId);

    if (pIdx == -1 || group.posts[pIdx].user != userId || group.admin != userId)
        throw new Error("User not authorized");

    group.posts.splice(pIdx, 1);
    await group.save();
    return await Post.deletePost(args);
}


const Group = mongoose.model("Group", GroupModel);
module.exports = Group;
