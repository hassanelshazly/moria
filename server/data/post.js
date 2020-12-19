const mongoose = require("mongoose");

const PostModel = require("../models/post");
const User = require("./user");
const Notification = require("./notification");
const { POST, LIKE, COMMENT } = require("../util/constant");

PostModel.statics.findPost = async function ({ postId }) {
    const post = await Post.findById(postId);
    await post.populate('user').execPopulate();
    return post;
}

PostModel.statics.findPosts = async function ({ userId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    await user.populate({
        path: 'posts',
        populate: {
            path: 'user'
        }
    }).execPopulate();
    return user.posts;
}

PostModel.statics.findLikes = async function ({ id }) {
    const post = await Post.findById(id);
    if (!post)
        throw new Error("Post not Found");

    await post.populate('likes').execPopulate();
    return post.likes;
}

PostModel.statics.findComments = async function ({ id }) {
    const post = await Post.findById(id);
    if (!post)
        throw new Error("Post not Found");

    await post.populate('comments.user').execPopulate();
    return post.comments;
}

PostModel.statics.likePost = async function ({ postId, userId }) {
    if (!userId)
        throw new Error("User not authorized");

    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not Found");

    await post.addOrRemoveLike({ userId });
    await Notification.createNotification({
        post,
        content: LIKE,
        contentId: post._id,
        author: userId
    });
    await post.populate('user').execPopulate();
    return post;
}

PostModel.statics.createPost = async function (args) {
    const { userId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const post = new Post({
        ...args,
        user: userId
    });
    await post.save();
    await Notification.createNotification({
        post,
        content: POST,
        contentId: post._id,
        author: post.user
    });
    await post.populate('user').execPopulate();
    return post;
}

PostModel.statics.createComment = async function (args) {
    const { postId, body, userId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not found");

    post.comments.push({ userId, body });
    await post.save();
    await Notification.createNotification({
        post,
        content: COMMENT,
        contentId: post._id,
        author: userId
    });
    await post.populate('user').execPopulate();
    return post;
}

PostModel.statics.deletePost = async function ({ postId, userId }) {
    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not found");

    if (!userId || userId != post.userId)
        throw new Error("User not authorized");

    await post.delete();
    return "Post deleted successfully";
}

PostModel.statics.deleteComment = async function ({ postId, commentId, userId }) {
    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not found");

    const cIdx = post.comments.findIndex(comment => comment._id == commentId);

    if (cIdx == -1 || post.comments[cIdx].userId != userId)
        throw new Error("User not authorized");

    post.comments.splice(cIdx, 1);
    await post.save();
    await post.populate('user').execPopulate();
    return post;
}

PostModel.methods.addOrRemoveLike = async function ({ userId }) {
    if (this.likes.includes(userId))
        this.likes = this.likes.filter(like => like != userId);
    else
        this.likes.push(userId);
    await this.save();
}


const Post = mongoose.model("Post", PostModel);
module.exports = Post;
