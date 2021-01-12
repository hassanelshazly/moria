const mongoose = require("mongoose");

const PostModel = require("../models/post");
const Notification = require("./notification");
const { uploadImage } = require("../util/image");
const { POST, LIKE, COMMENT } = require("../util/constant");

PostModel.statics.findPost = async function ({ postId }) {
    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not Found");
    return post;
}

PostModel.statics.findUser = async function ({ id }) {
    const post = await Post.findById(id);
    if (!post)
        throw new Error("Post not Found");
    await post.populate('user').execPopulate();
    return post.user;
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
    return post;
}

PostModel.statics.createPost = async function (args) {
    const { userId, groupId, pageId } = args;
    let contentType = POST;
    if (!userId)
        throw new Error("User not authorized");

    const post = new Post({
        ...args,
        user: userId,
        group: groupId,
        page: pageId
    });

    if(args.imageSrc) 
        post.imageUrl = await uploadImage(imageSrc);
    
    await post.save();
    
    // TODO
    // notifications to group & pages
    await Notification.createNotification({
        post,
        content: contentType,
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

    post.comments.push({ user: userId, body });
    await post.save();
    await Notification.createNotification({
        post,
        content: COMMENT,
        contentId: post._id,
        author: userId
    });
    return post;
}

PostModel.statics.deletePost = async function ({ postId, userId }) {
    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not found");

    if ((userId != post.user) && !post.group)
        throw new Error("User not authorized");

    await post.delete();
    await Notification.deleteMany({
        content: POST,
        contentId: post._id,
        author: post.user
    });
    return "Post deleted successfully";
}

PostModel.statics.deleteComment = async function (args) {
    const { postId, commentId, userId } = args;
    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not found");

    const cIdx = post.comments.findIndex(comment => comment._id == commentId);

    if (cIdx == -1 || post.comments[cIdx].userId != userId)
        throw new Error("User not authorized");

    post.comments.splice(cIdx, 1);
    await post.save();
    await post.populate('user').execPopulate();
    await Notification.deleteMany({
        content: COMMENT,
        contentId: post._id,
        author: userId
    });
    return post;
}

PostModel.methods.addOrRemoveLike = async function ({ userId }) {
    if (this.likes.includes(userId)) {
        this.likes = this.likes.filter(like => like != userId);
        await this.save();
        await Notification.deleteMany({
            content: LIKE,
            contentId: this._id,
            author: userId
        })
    }
    else {
        this.likes.push(userId);
        await this.save();
        await Notification.createNotification({
            post: this,
            content: LIKE,
            contentId: this._id,
            author: userId
        });
    }

}

const Post = mongoose.model("Post", PostModel);
module.exports = Post;
