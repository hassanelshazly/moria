const postResolvers = require('./post');
const userResolvers = require('./user');
const messageResolvers = require('./message');
const groupChatResolvers = require("./chat");
const notificationResolvers = require('./notification');
const { UserGroup } = require('./message');

module.exports = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...messageResolvers.Query,
        ...groupChatResolvers.Query,
        ...notificationResolvers.Query
    },

    Mutation: {
        ...postResolvers.Mutation,
        ...userResolvers.Mutation,
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