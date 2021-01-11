const Group = require("../../data/group");
const Post = require("../../data/post");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {
        findGroup(_, args) {
            return Group.findGroup(args);
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
            return Page.createPost({
                ...args,
                ...getAuthUser(context)
            });
        },

        deleteGroupPost(_, args, context) {
            return Page.deletePost({
                ...args,
                ...getAuthUser(context)
            });
        }
    },


    Group: {
        posts(parent, args) {
            return null;
        },

        members(parent, args) {
            return null;
        }
    }
}