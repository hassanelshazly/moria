const Post = require("../../data/post");
const User = require("../../data/user");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {

        findPost(_, args) {
            return Post.findPost(args);
        },
    },

    Mutation: {
        likePost(_, args, context) {
            return Post.likePost({
                ...args,
                ...getAuthUser(context)
            });
        },

        createPost(_, args, context) {
            return Post.createPost({
                ...args,
                ...getAuthUser(context)
            });
        },

        createComment(_, args, context) {
            return Post.createComment({
                ...args,
                ...getAuthUser(context)
            });
        },

        deletePost(_, args, context) {
            return Post.deletePost({
                ...args,
                ...getAuthUser(context)
            });
        },

        deleteComment(_, args, context) {
            return Post.deleteComment({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    Post: {
        likeCount(parent) {
            return parent.likes.length;
        },

        commentCount(parent) {
            return parent.comments.length;
        },

        likes(parent) {
            return Post.findLikes({ id: parent.id });
        },

        comments(parent) {
            return Post.findComments({ id: parent.id });
        }
    }
}