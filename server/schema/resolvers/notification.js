const { withFilter } = require("apollo-server");

const Notification = require("../../data/notification");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {
        findNotifications(_, args, context) {
            return Notification.findNotifications({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    Mutation: {
        
    },

    Subscription: {
       
    }
}