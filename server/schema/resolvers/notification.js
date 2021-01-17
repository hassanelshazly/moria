const { withFilter } = require('apollo-server-express');

const User = require("../../data/user");
const { getAuthUser } = require("../../util/auth");
const { pubSub, NEW_NOTIFICATION } = require("../../util/subscription");

module.exports = {

    Query: {
        findNotifications(_, args, context) {
            return User.findNotifications({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    Mutation: {

    },

    Subscription: {
        newNotification: {
            subscribe: withFilter(
                (_, args, context) => {
                    args.userId = getAuthUser(context).userId;
                    return pubSub.asyncIterator([NEW_NOTIFICATION]);
                },
                ({ newNotification }, { userId }) => {
                    return userId == newNotification.user._id;
                }
            )
        }
    }
}