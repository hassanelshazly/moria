const mongoose = require("mongoose");

const NotificationModel = require("../models/notification");
const User = require("./user");
const {
    FOLLOW,
    POST,
    LIKE,
    COMMENT
} = require("../util/constant");


async function resolvePost(post) {
    await post.populate('user').execPopulate();
    console.log(post.user.following.map(following => following._id));
    return post.user.following.map(following => following._id);
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

async function resolveUsers({ author, content, contentId, post }) {
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
        default:
            throw new Error("Not recognized notification type")
    }
    return users.filter(user => user != author);
}

NotificationModel.statics.createNotification = async function (args) {
    const users = await resolveUsers(args);
    const { author, content, contentId, post } = args;
    const notifications = users.map(user => new Notification({
        user,
        author,
        content,
        contentId
    }));

    for (const notification of notifications) {
        await notification.save();
    }
}

NotificationModel.statics.findNotifications = async function ({ userId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");
    await user.populate({
        path: 'notifications',
        populate: [
            {
                path: 'user'
            }, 
            {
                path: 'author'
            }
        ]
    }).execPopulate();
    return user.notifications;
}

const Notification = mongoose.model("Notification", NotificationModel);
module.exports = Notification;

