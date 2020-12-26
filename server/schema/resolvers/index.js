const postResolvers = require('./post');
const userResolvers = require('./user');
const pageResolvers = require("./page");
const groupResolvers = require("./group");
const messageResolvers = require('./message');
const groupChatResolvers = require("./chat");
const notificationResolvers = require('./notification');

module.exports = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...pageResolvers.Query,
        ...groupResolvers.Query,
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

    User: {
        ...userResolvers.User
    },

    Post: {
        ...postResolvers.Post
    },

    UserGroup: {
        ...messageResolvers.UserGroup
    }
};