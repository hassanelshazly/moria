const postResolvers = require('./post');
const userResolvers = require('./user');
const pageResolvers = require("./page");
const groupResolvers = require("./group");
const searchResolvers = require("./search");
const messageResolvers = require('./message');
const groupChatResolvers = require("./chat");
const notificationResolvers = require('./notification');

module.exports = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...pageResolvers.Query,
        ...groupResolvers.Query,
        ...searchResolvers.Query,
        ...messageResolvers.Query,
        ...groupChatResolvers.Query,
        ...notificationResolvers.Query
    },

    Mutation: {
        ...postResolvers.Mutation,
        ...userResolvers.Mutation,
        ...pageResolvers.Mutation,
        ...groupResolvers.Mutation,
        ...messageResolvers.Mutation,
        ...groupChatResolvers.Mutation,
        ...notificationResolvers.Mutation
    },

    Subscription: {
        ...messageResolvers.Subscription,
        ...notificationResolvers.Subscription
    },

    Post: {
        ...postResolvers.Post
    },

    User: {
        ...userResolvers.User
    },

    Page: {
        ...pageResolvers.Page
    },

    Group: {
        ...groupResolvers.Group
    },

    UserGroup: {
        ...messageResolvers.UserGroup
    },

    SearchUnion: {
        ...searchResolvers.SearchUnion
    }
};