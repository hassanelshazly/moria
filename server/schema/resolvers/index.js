const postResolvers = require('./post');
const userResolvers = require('./user');
const messageResolvers = require('./message');

module.exports = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...messageResolvers.Query
    },

    Mutation: {
        ...postResolvers.Mutation,
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation
    },

    Subscription: {
        ...messageResolvers.Subscription
    },

    User: {
        ...userResolvers.User
    },

    Post: {
        ...postResolvers.Post
    }
};