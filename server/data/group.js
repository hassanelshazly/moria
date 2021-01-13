const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Notification = require("./notification");
const User = require("./user");
const Post = require("./post");
const GroupModel = require("../models/group");
const { uploadImage } = require("../util/image");
const { getAuthUser } = require("../util/auth");
const {
    GROUP_ADD,
    GROUP_POST,
    GROUP_REQUEST
} = require("../util/constant");

GroupModel.statics.findGroup = async function ({ groupId }) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");
    return group;
}

GroupModel.statics.findAllGroups = async function (args) {
    return (await Group.find({})).sort((a, b) => b.createdAt - a.createdAt);
}

GroupModel.statics.findAdmin = async function ({ id }) {
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    await group.populate('admin').execPopulate();
    return group.admin;
}

GroupModel.statics.findMembers = async function ({ id }) {
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    await group.populate('members').execPopulate();
    return group.members;
}

GroupModel.statics.findPosts = async function ({ id, context }) {
    try {
        var { userId } = getAuthUser(context);
    } catch (err) {
        return null;
    }
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    if (!group.members.includes(userId) && group.admin != userId)
        return null;

    await group.populate('posts').execPopulate();
    return group.posts.sort((a, b) => b.createdAt - a.createdAt);
}

GroupModel.statics.findRequests = async function ({ id, context }) {
    try {
        var { userId } = getAuthUser(context);
    } catch (err) {
        return null;
    }
    const group = await Group.findById(id);
    if (!group)
        throw new Error("Group not found");

    if (group.admin != userId)
        return null;

    await group.populate('requests').execPopulate();
    return group.requests;
}

GroupModel.statics.createGroup = async function (args) {
    let { userId, title, membersId, coverSrc, profileSrc } = args;
    if (!userId)
        throw new Error("User not authorized")

    // const user = await User.findById(userId);
    // if (!user)
    //     throw new Error("User not found");

    membersId.push(userId);
    membersId = [...new Set(membersId)];
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
        // members: membersId
    });

    if (coverSrc)
        group.coverUrl = await uploadImage(coverSrc);

    if (profileSrc)
        group.profileUrl = await uploadImage(profileSrc);

    await group.save();
    for (member of members) {
        await member.addOrRemoveGroup(group._id);
        await group.addOrRemoveMember(member._id);
    }

    return group;
}

GroupModel.statics.sendRequest = async function ({ groupId, userId }) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    if (group.members.includes(userId))
        throw new Error("User already a member");

    await group.addOrRemoveRequest(userId);
    await user.addOrRemoveRequest(group._id);
    return group;
}

GroupModel.statics.acceptRequest = async function ({ groupId, userId, memberId }) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const member = await User.findById(memberId);
    if (!member)
        throw new Error("Member not found");

    if (group.admin != userId)
        throw new Error("User not authoried");

    if (!group.requests.includes(memberId))
        throw new Error("User hasn't join");

    await group.addOrRemoveRequest(memberId);
    await user.addOrRemoveRequest(group._id);
    await group.addOrRemoveMember(memberId);
    return group;
}

GroupModel.statics.addMembers = async function ({ groupId, userId, membersId }) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    if (group.admin != userId)
        throw new Error("User not authoried");

    if (membersId.includes(userId))
        throw new Error("You can't remove your self, It's your group");

    membersId = [...new Set(membersId)];

    const members = await Promise.all(
        membersId.map(async memberId => {
            const member = await User.findById(memberId);
            if (!member)
                throw new Error("Member not found");
            return member;
        })
    );

    for (member of members) {
        await member.addOrRemoveGroup(group._id);
        await group.addOrRemoveMember(member._id);
        if (group.requests.includes(member._id)) {
            await member.addOrRemoveRequest(group._id);
            await group.addOrRemoveRequest(member._id);
        }
    }
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
    return await group.save();
}

GroupModel.statics.deleteGroup = async function ({ groupId, userId }) {
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    if (!userId || userId != group.admin)
        throw new Error("User not authorized");

    for (post of group.posts)
        await Post.findByIdAndDelete(post);

    await group.populate('members').execPopulate();
    for (member of group.members)
        member.addOrRemoveGroup(group._id);

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


    if (!group.members.includes(userId) &&
        group.admin.toString() != userId.toString())
        throw new Error("User not authorized")

    const post = await Post.createPost(args);
    group.posts.push(post._id);
    await group.save();

    await Notification.createNotification({
        group,
        content: GROUP_POST,
        contentId: group._id,
        author: userId
    });

    return post;
}

GroupModel.statics.deleteGroupPost = async function (args) {
    const { groupId, postId, userId } = args;
    const group = await Group.findById(groupId);
    if (!group)
        throw new Error("Group not found");

    const pIdx = group.posts.findIndex(post =>
        post.toString() == postId.toString());

    if (pIdx == -1)
        throw new Error("Post not found");

    const post = await Post.findById(group.posts[pIdx]);
    if (post.user != userId && group.admin != userId)
        throw new Error("User not authorized");

    group.posts.splice(pIdx, 1);
    await group.save();
    const result = await Post.deletePost(args);

    await Notification.deleteMany({
        content: GROUP_POST,
        contentId: group._id,
        author: userId
    });

    return result;
}

GroupModel.methods.addOrRemoveRequest = async function (userId) {
    if (this.requests.includes(userId)) {
        this.requests = this.requests.filter(request =>
            request.toString() != userId.toString());
        await this.save();
        await Notification.deleteMany({
            content: GROUP_REQUEST,
            contentId: this._id,
            author: userId
        });
    }
    else {
        this.requests.push(userId);
        await this.save();
        await Notification.createNotification({
            group: this,
            content: GROUP_REQUEST,
            contentId: this._id,
            author: userId
        });
    }
}

GroupModel.methods.addOrRemoveMember = async function (userId) {
    if (this.members.includes(userId)) {
        this.members = this.members.filter(member =>
            member.toString() != userId.toString());
        await this.save();
        await Notification.deleteMany({
            user: userId,
            content: GROUP_ADD,
            contentId: this._id,
            author: this.admin
        });
    }
    else {
        this.members.push(userId);
        await this.save();
        await Notification.createNotification({
            group: this,
            user: userId,
            content: GROUP_ADD,
            contentId: this._id,
            author: this.admin
        });
    }
}


const Group = mongoose.model("Group", GroupModel);
module.exports = Group;
