const mongoose = require("mongoose");

const NotificationModel = require("../models/notification");
const { pubSub, NEW_NOTIFICATION } = require("../util/subscription");
const {
    FOLLOW,
    POST,
    LIKE,
    COMMENT,
    GROUP_ADD,
    GROUP_POST,
    GROUP_REQUEST,
} = require("../util/constant");

async function resolveGroupAdd(user) {
    return [user];
}

async function resolveGroupPost(group) {
    return group.members;
}

async function resolveGroupRequest(group) {
    return [group.admin._id];
}

async function resolvePost(post) {
    await post.populate('user').execPopulate();
    return post.user.followers.map(follower => follower._id);
}

async function resolveFollow(user) {
    return [user];
}

async function resolveLike(post) {
    return [post.user._id];
}

async function resolveComment(post) {
    const commentAuthors = new Set();
    commentAuthors.add(post.user._id);
    post.comments.forEach(comment => {
        commentAuthors.add(comment.user._id)
    });
    return [...commentAuthors];
}

async function resolveUsers(args) {
    let { author, content, contentId, post, group, user } = args;
    let users;
    switch (content) {
        case FOLLOW:
            users = await resolveFollow(contentId);
            break;
        case POST:
            users = await resolvePost(post);
            break;
        case LIKE:
            users = await resolveLike(post);
            break;
        case COMMENT:
            users = await resolveComment(post);
            break;
        case GROUP_ADD:
            users = await resolveGroupAdd(user);
            break;
        case GROUP_POST:
            users = await resolveGroupPost(group);
            break;
        case GROUP_REQUEST:
            users = await resolveGroupRequest(group);
            break;
        default:
            throw new Error("Not recognized notification type")
    }
    return users.filter(user => user.toString() != author.toString());
}

NotificationModel.statics.createNotification = async function (args) {
    const users = await resolveUsers(args);
    const { author, content, contentId } = args;
    const notifications = users.map(user => new Notification({
        user,
        author,
        content,
        contentId
    }));

    for (const notification of notifications) {
        await notification.save();
        await notification.populate("user").populate("author").execPopulate();
        await pubSub.publish(NEW_NOTIFICATION, { newNotification: notification });
    }
}

const Notification = mongoose.model("Notification", NotificationModel);
module.exports = Notification;

