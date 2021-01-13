const { withFilter } = require("apollo-server");

const Message = require("../../data/message");
const { getAuthUser } = require("../../util/auth");
const { pubSub, NEW_MESSAGE } = require("../../util/subscription");

module.exports = {

    Query: {
        findMessages(_, args, context) {
            return Message.findMessages({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    Mutation: {
        sendMessage(_, args, context) {
            return Message.sendMessage({
                ...args,
                ...getAuthUser(context)
            });
        },
    },

    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, args, context) => {
                    args.userId = getAuthUser(context).userId;
                    return pubSub.asyncIterator([NEW_MESSAGE]);
                },
                ({ newMessage }, { userId }) => {
                    const { to, from } = newMessage;
                    return userId == to.id || userId == from.id;
                }
            )
        }
    },

    Message: {
        // to(parent) {
        //     return Message.findTo({ id: parent.id });
        // },

        // from(parent) {
        //     return Message.findFrom({ id: parent.id })
        // }
    },

    UserGroup: {
        __resolveType(obj, context, info) {
            if (obj.username) {
                return 'User';
            }

            if (obj.admin) {
                return 'GroupChat';
            }

            return null;
        },
    }
}