const User = require("../../data/user");
const Post = require("../../data/post");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {
        findUser(_, args) {
            return User.findUser(args);
        }
    },

    Mutation: {
        register(_, args) {
            return User.register(args);
        },

        login(_, args) {
            return User.login(args);
        },

        loginUsingGoogle(_, args) {
            return User.googleLogin(args);
        },

        loginUsingFacebook(_, args) {
            return User.facebookLogin(args);
        },

        follow(_, args, context) {
            return User.follow({
                ...args,
                ...getAuthUser(context)
            });
        },

        savePost(_, args, context) {
            return User.savePost({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    User: {
        posts(parent, args) {
            return Post.findPosts(parent);
        },

        savedPosts(parent, args) {
            return Post.findSavedPosts(parent);
        },

        followers(parent, args) {
            return User.findFollowers(parent);
        },

        following(parent, args) {
            return User.findFollowing(parent);
        }
    }
}