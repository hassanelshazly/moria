const GroupChat = require("../../data/chat");
const { getAuthUser } = require("../../util/auth");

module.exports = {
    Query: {
        findGroupChats(_, args, context) {
            return GroupChat.findGroupChats({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    Mutation: {
        createGroupChat(_, args, context) {
            return GroupChat.createGroupChat({
                ...args,
                ...getAuthUser(context)
            });
        },

        sendGroupMessage(_, args, context) {
            return GroupChat.sendGroupMessage({
                ...args,
                ...getAuthUser(context)
            });
        }
    },

    GroupChat: {
        admin(parent) {
            return GroupChat.findAdmin({ id: parent.id });
        },

        members(parent) {
            return GroupChat.findMembers({ id: parent.id });
        },

        messages(parent) {
            return GroupChat.findMessages({ id: parent.id });
        }
    }

}