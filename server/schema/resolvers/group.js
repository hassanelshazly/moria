const Group = require("../../data/group");
const Post = require("../../data/post");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {
        findGroup(_, args) {
            return Group.findGroup(args);
        },

        findAllGroups(_, args) {
            return Group.findAllGroups(args);
        }
    },

    Mutation: {
        createGroup(_, args, context) {
            return Group.createGroup({
                ...args,
                ...getAuthUser(context)
            });
        },

        deleteGroup(_, args, context) {
            return Group.deleteGroup({
                ...args,
                ...getAuthUser(context)
            })
        },

        createGroupPost(_, args, context) {
            return Group.createGroupPost({
                ...args,
                ...getAuthUser(context)
            });
        },

        deleteGroupPost(_, args, context) {
            return Group.deleteGroupPost({
                ...args,
                ...getAuthUser(context)
            });
        },

        sendRequest(_, args, context) {
            return Group.sendRequest({
                ...args,
                ...getAuthUser(context)
            });
        },

        acceptRequest(_, args, context) {
            return Group.acceptRequest({
                ...args,
                ...getAuthUser(context)
            });
        },

        addMembers(_, args, context) {
            return Group.addMembers({
                ...args,
                ...getAuthUser(context)
            });
        },

        changeGroupCover(_, args, context) {
            return Group.changeGroupCover({
                ...args,
                ...getAuthUser(context)
            });
        },

        changeGroupProfile(_, args, context) {
            return Group.changeGroupProfile({
                ...args,
                ...getAuthUser(context)
            });
        }
    },


    Group: {
        admin(parent, args, context) {
            return Group.findAdmin({ id: parent.id });
        },

        posts(parent, args, context) {
            return Group.findPosts({
                id: parent.id,
                context
            });
        },

        members(parent, args, context) {
            return Group.findMembers({
                id: parent.id,
                context
            });
        },

        membersCount(parent, args, context) {
            return parent.members.length;
        },

        requests(parent, args, context) {
            return Group.findRequests({
                id: parent.id,
                context
            });
        }
    }
}