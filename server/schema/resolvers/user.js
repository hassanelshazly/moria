const User = require("../../data/user");
const Post = require("../../data/post");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {
        findUser(_, args) {
            return User.findUser(args);
        },

        findAllUsers(_, args) {
            return User.findAllUsers(args);
        },

        findPosts(_, args) {
            return User.findPosts({
                ...args,
                id: args.userId
            });
        },

        findTimeline(_, args, context) {
            return User.findTimeline({
                ...args,
                ...getAuthUser(context)
            });
        },

        isActivated(_, args, context) {
            return User.isActivated({
                ...args,
                ...getAuthUser(context)
            });
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

        verifyAccount(_, args, context) {
            return User.verifyAccount(args);
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
        },

        sharePost(_, args, context) {
            return User.sharePost({
                ...args,
                ...getAuthUser(context)
            });
        },

        changeCover(_, args, context) {
            return User.changeCover({
                ...args,
                ...getAuthUser(context)
            });
        },

        changeProfile(_, args, context) {
            return User.changeProfile({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    User: {
        posts(parent, args) {
            return User.findPosts({ id: parent.id });
        },

        savedPosts(parent, args) {
            return User.findSavedPosts({ id: parent.id });
        },

        followers(parent, args) {
            return User.findFollowers({ id: parent.id });
        },

        following(parent, args) {
            return User.findFollowing({ id: parent.id });
        },

        pages(parent, args) {
            return User.findPages({ id: parent.id });
        },

        groups(parent, args) {
            return User.findGroups({ id: parent.id });
        },

        requests(parent, args) {
            return User.findRequests({ id: parent.id });
        }
    }
}