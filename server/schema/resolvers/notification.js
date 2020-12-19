const { withFilter } = require("apollo-server");

const User = require("../../data/user");
const { getAuthUser } = require("../../util/auth");

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
       
    }
}