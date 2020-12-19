const postResolvers = require('./post');
const userResolvers = require('./user');
const messageResolvers = require('./message');
const notificationResolvers = require('./notification');

module.exports = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...messageResolvers.Query,
        ...notificationResolvers.Query
    },

    Mutation: {
        ...postResolvers.Mutation,
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation,
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
    }
};