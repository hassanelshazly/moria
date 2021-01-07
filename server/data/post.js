const mongoose = require("mongoose");

const PostModel = require("../models/post");
const User = require("./user");

PostModel.statics.findPost = async function ({ postId }) {
    return Post.findById(postId);
}

PostModel.statics.findPosts = async function ({ id }) {
    const user = await User.findById(id);
    await user.populate('posts').execPopulate()
    return user.posts;
}

PostModel.statics.likePost = async function ({ postId, userId }) {
    if (!userId)
        throw new Error("User not authorized");

    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not Found")

    await post.addOrRemoveLike({ userId });
    return post;
}

PostModel.statics.createPost = async function (args) {
    const { userId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const post = new Post(args);
    return post.save();
}

PostModel.statics.createComment = async function (args) {
    const { postId, body, userId } = args;
    if (!userId)
        throw new Error("User not authorized");

    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not found");

    post.comments.push({ userId, body });
    return await post.save();
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
    return await post.save();
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
