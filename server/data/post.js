const mongoose = require("mongoose");

const PostModel = require("../models/post");
const User = require("./user");

PostModel.statics.findPost = async function ({ postId }) {
    return Post.findById(postId);
}

PostModel.statics.findPosts = async function ({ username }) {
    const user = await User.findOne({ username })
    await user.populate('posts').execPopulate()
    return user.posts;
}

PostModel.statics.likePost = async function ({ postId, username }) {
    if (!username)
        throw new Error("User not authorized");

    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not Found")
    console.log(post);
    await post.addOrRemoveLike({ username });
    return post;
}

PostModel.statics.createPost = async function (args) {
    const { username } = args;
    if (!username)
        throw new Error("User not authorized");

    const post = new Post(args);
    return post.save();
}

PostModel.statics.createComment = async function (args) {
    const { postId, body, username } = args;
    if (!username)
        throw new Error("User not authorized");

    const post = Post.findById(postId);
    post.addComment({ username, body });
    return post;
}

PostModel.statics.deletePost = async function ({ postId, username }) {
    // TODO
    return null;
}

PostModel.statics.deleteComment = async function ({ postId, username }) {
    // TODO 
    return null;
}

PostModel.methods.addOrRemoveLike = async function ({ username }) {
    if (this.likes.find(like => like.username == username))
        this.likes = this.likes.filter(like => like.username != username);
    else
        this.likes.push({ username });
    await this.save();
}

PostModel.methods.addComment = async function ({ username, body }) {
    this.comments.push({ username, body });
    await this.save();
}


const Post = mongoose.model("Post", PostModel);
module.exports = Post;
