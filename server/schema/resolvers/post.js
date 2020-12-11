const Post = require("../../data/post");
const { getUsername } = require("../../util/auth");

module.exports = {

    Query: {

        findPost(_, args) {
            return Post.findPost(args);
        },

        findPosts(_, args) {
            return Post.findPosts(args);
        }
    },

    Mutation: {
        likePost(_, args, context) {
            return Post.likePost({
                ...args,
                username: getUsername(context)
            });
        },

        createPost(_, args, context) {
            return Post.createPost({
                ...args,
                username: getUsername(context)
            });
        },

        createComment(_, args, context) {
            return Post.createComment({
                ...args,
                username: getUsername(context)
            });
        },

        deletePost(_, args, context) {
            // TODO
            return null;
        },

        deleteComment(_, args, context) {
            // TODO
            return null;
        }
    },

    Post: {
        likeCount(parent) {
            return parent.likes.length;
        },

        commentCount(parent) {
            return parent.comments.length;
        }
    }
}